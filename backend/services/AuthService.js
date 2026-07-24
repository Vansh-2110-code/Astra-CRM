const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtRefreshSecret } = require('../config/dbConfig');
const redisClient = require('../config/redis');
const EmployeeRepository = require('../repositories/EmployeeRepository');
const RoleRepository = require('../repositories/RoleRepository');
const TenantRepository = require('../repositories/TenantRepository');

class AuthService {
  async login(email, password) {
    const employee = await EmployeeRepository.findByEmail(email);
    if (!employee) {
      throw new Error('Invalid credentials or employee profile not found.');
    }

    const passwordMatch = await bcrypt.compare(password, employee.passwordHash);
    if (!passwordMatch) {
      throw new Error('Invalid credentials or employee profile not found.');
    }

    const role = await RoleRepository.findById(employee.roleId);
    const tenant = await TenantRepository.findById(employee.clientId);

    const accessToken = jwt.sign(
      {
        userId: employee.id,
        email: employee.email,
        tenantId: employee.clientId,
        role: role ? role.name : 'Sales Executive'
      },
      jwtSecret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        userId: employee.id,
        tenantId: employee.clientId
      },
      jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    // Save refresh token in Redis
    if (redisClient) {
      await redisClient.set(`refresh:${employee.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
    }

    return {
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        designation: employee.designation,
        avatar: employee.avatar,
        role: role ? role.name : 'Sales Executive',
        roleId: employee.roleId,
        tenantId: employee.clientId
      },
      accessToken,
      refreshToken
    };
  }

  async refresh(refreshToken) {
    let payload;
    try {
      payload = jwt.verify(refreshToken, jwtRefreshSecret);
    } catch (e) {
      throw new Error('Access Forbidden: Invalid Refresh Token Signature');
    }

    if (redisClient) {
      const savedToken = await redisClient.get(`refresh:${payload.userId}`);
      if (savedToken !== refreshToken) {
        throw new Error('Access Forbidden: Stale or Revoked Refresh Token');
      }
    }

    const employee = await EmployeeRepository.findById(payload.userId);
    if (!employee) {
      throw new Error('Employee profile not found.');
    }

    const role = await RoleRepository.findById(employee.roleId);

    const newAccessToken = jwt.sign(
      {
        userId: employee.id,
        email: employee.email,
        tenantId: employee.clientId,
        role: role ? role.name : 'Sales Executive'
      },
      jwtSecret,
      { expiresIn: '15m' }
    );

    return { accessToken: newAccessToken };
  }

  async logout(userId) {
    if (redisClient) {
      await redisClient.del(`refresh:${userId}`);
    }
    return true;
  }

  async signup(userData) {
    const { email, password, name, company, signupType, tenantId: userTenantId } = userData;
    if (!email || !password || !name) {
      throw new Error('All fields (name, email, password) are required.');
    }

    const existingEmployee = await EmployeeRepository.findByEmail(email);
    if (existingEmployee) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    let tenantId;
    let userRole = 'role-admin';
    let userDesignation = 'Super Admin / Org Admin';

    if (signupType === 'join') {
      const searchKey = (company || userTenantId || '').trim().toLowerCase();
      if (!searchKey) {
        throw new Error('Please enter your Company Name or Organization ID to join.');
      }

      let targetTenant = null;
      const allTenants = await TenantRepository.findAll();
      
      // 1. Exact match by Tenant ID, Name, or Subdomain
      targetTenant = allTenants.find(t => 
        t.id.toLowerCase() === searchKey ||
        t.name.toLowerCase() === searchKey ||
        (t.subdomain && t.subdomain.toLowerCase() === searchKey)
      );

      // 2. Partial match by Name
      if (!targetTenant) {
        targetTenant = allTenants.find(t => 
          t.name.toLowerCase().includes(searchKey) ||
          searchKey.includes(t.name.toLowerCase())
        );
      }

      // 3. If no existing tenant match, auto-provision tenant specifically for this company name
      if (!targetTenant) {
        const newTenantId = `client-${Date.now().toString().slice(-4)}`;
        const subdomain = searchKey.replace(/[^a-z0-9]/g, '') || `org-${Date.now()}`;
        
        targetTenant = await TenantRepository.create({
          id: newTenantId,
          name: company || userTenantId,
          subdomain,
          logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          industry: 'Enterprise Services',
          plan: 'Enterprise',
          status: 'Active',
          maxSeats: 50,
          currency: 'USD ($)'
        });
      }

      tenantId = targetTenant.id;
      userRole = 'role-exec';
      userDesignation = 'Sales Representative';
    } else {
      if (!company) {
        throw new Error('Organization name is required to register a new company.');
      }
      tenantId = `client-${Date.now().toString().slice(-4)}`;
      const subdomain = company.toLowerCase().replace(/[^a-z0-9]/g, '') || `org-${Date.now()}`;

      await TenantRepository.create({
        id: tenantId,
        name: company,
        subdomain,
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        industry: 'Enterprise Services',
        plan: 'Enterprise',
        status: 'Active',
        maxSeats: 50,
        currency: 'USD ($)'
      });
    }

    // Hash Password & Create Employee Profile
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const empId = `EMP-${Date.now().toString().slice(-4)}`;

    const employee = await EmployeeRepository.create({
      id: empId,
      clientId: tenantId,
      name,
      email,
      designation: userDesignation,
      roleId: userRole,
      passwordHash,
      baseSalary: signupType === 'join' ? 55000 : 95000,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    });

    // 3. Generate Auth Tokens
    const role = await RoleRepository.findById('role-admin');
    const accessToken = jwt.sign(
      {
        userId: employee.id,
        email: employee.email,
        tenantId: employee.clientId,
        role: role ? role.name : 'Super Admin / Org Admin'
      },
      jwtSecret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        userId: employee.id,
        tenantId: employee.clientId
      },
      jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    if (redisClient) {
      await redisClient.set(`refresh:${employee.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
    }

    return {
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        designation: employee.designation,
        avatar: employee.avatar,
        role: role ? role.name : 'Super Admin / Org Admin',
        roleId: employee.roleId,
        tenantId: employee.clientId
      },
      accessToken,
      refreshToken
    };
  }
}

module.exports = new AuthService();

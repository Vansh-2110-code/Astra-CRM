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
    const { email, password, name, company } = userData;
    if (!email || !password || !name || !company) {
      throw new Error('All fields (name, company, email, password) are required.');
    }

    const existingEmployee = await EmployeeRepository.findByEmail(email);
    if (existingEmployee) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    // 1. Create new Tenant ID & record
    const tenantId = `client-${Date.now().toString().slice(-4)}`;
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

    // 2. Hash Password & Create Primary Admin Employee
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const empId = `EMP-${Date.now().toString().slice(-4)}`;

    const employee = await EmployeeRepository.create({
      id: empId,
      clientId: tenantId,
      name,
      email,
      designation: 'Super Admin / Org Admin',
      roleId: 'role-admin',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
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

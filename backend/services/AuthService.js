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
}

module.exports = new AuthService();

const BaseRepository = require('./BaseRepository');
const Employee = require('../models/Employee');

class EmployeeRepository extends BaseRepository {
  constructor() {
    super(Employee);
  }

  async findByEmail(email) {
    return this.findOne({ where: { email } });
  }

  async findByTenant(clientId) {
    return this.findAll({ where: { clientId } });
  }
}

module.exports = new EmployeeRepository();

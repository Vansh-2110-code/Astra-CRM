const BaseRepository = require('./BaseRepository');
const Tenant = require('../models/Tenant');

class TenantRepository extends BaseRepository {
  constructor() {
    super(Tenant);
  }
}

module.exports = new TenantRepository();

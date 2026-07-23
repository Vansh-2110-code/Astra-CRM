const cron = require('node-cron');
const { Quote } = require('../models');
const { emitToTenant } = require('./socket');
const { Op } = require('sequelize');

function initCronJobs() {
  console.log('⏰ Initializing scheduled automation cron jobs...');

  // Runs once every hour to audit expiring quotes (SaaS automation workflow)
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running scheduled audit: Checking for expiring quotations...');
    try {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const expiringQuotes = await Quote.findAll({
        where: {
          status: 'Draft',
          validUntil: {
            [Op.lte]: thirtyDaysFromNow
          }
        }
      });

      console.log(`⏰ Found ${expiringQuotes.length} expiring quotes.`);

      expiringQuotes.forEach(quote => {
        // Emit reminder warning to that tenant's active sales sockets
        emitToTenant(quote.clientId, 'quote_expiring_soon', {
          quoteId: quote.id,
          customerName: quote.customerName,
          validUntil: quote.validUntil,
          grandTotal: quote.grandTotal
        });
        console.log(`[Automation Trigger] Notification dispatched for Quote ${quote.id} to Tenant ${quote.clientId}`);
      });

    } catch (error) {
      console.error('Error during expiring quotes cron execution:', error);
    }
  });
}

module.exports = {
  initCronJobs
};

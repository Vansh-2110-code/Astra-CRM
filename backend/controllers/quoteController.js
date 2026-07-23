const QuoteService = require('../services/QuoteService');

exports.getQuotes = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const quotes = await QuoteService.getQuotesByTenant(tenantId);
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createQuote = async (req, res) => {
  try {
    const tenantId = req.tenant.id;
    const quote = await QuoteService.createQuote(tenantId, req.body);
    res.status(201).json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const LeadRepository = require('../repositories/LeadRepository');

let metaConfig = {
  pageId: '10049281048',
  accessToken: 'EAAG_MOCK_META_ACCESS_TOKEN_2026',
  verifyToken: 'astra_meta_leadgen_token_2026',
  status: 'Connected'
};

// 1. Meta Webhook Verification (GET /api/integrations/meta-ads/webhook)
exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = metaConfig.verifyToken || 'astra_meta_leadgen_token_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[Meta Webhook Verified Successfully]: Challenge Token matched.');
    return res.status(200).send(challenge);
  } else {
    console.warn('[Meta Webhook Verification Failed]: Token mismatch or invalid mode.');
    return res.sendStatus(403);
  }
};

// 2. Meta Real-time Lead Webhook Receiver (POST /api/integrations/meta-ads/webhook)
exports.receiveWebhookLead = async (req, res) => {
  try {
    const body = req.body;
    console.log('[Meta Webhook Event Received]:', JSON.stringify(body));

    if (body.object === 'page') {
      for (const entry of (body.entry || [])) {
        for (const change of (entry.changes || [])) {
          if (change.field === 'leadgen') {
            const leadVal = change.value;
            const leadgenId = leadVal.leadgen_id || Date.now().toString();
            const pageId = leadVal.page_id || '10049281048';
            const formId = leadVal.form_id || '4920491823901';

            // Compute AI Score for Meta Ads Lead (Base 60 + 25 Meta Ads Trust Boost)
            const score = 85;
            const newLeadData = {
              id: `LEAD-META-${Date.now()}`,
              clientId: 'client-001',
              name: leadVal.full_name || `Meta Lead #${leadgenId.slice(-4)}`,
              companyName: leadVal.company_name || 'Facebook Lead Gen Prospect',
              email: leadVal.email || `lead.${leadgenId.slice(-6)}@meta-ad-campaign.io`,
              phone: leadVal.phone_number || '+1-555-META-LEAD',
              source: 'Meta Ads',
              status: 'New',
              value: 45000,
              score: score,
              notes: `Meta Lead Gen ID: ${leadgenId} | Page ID: ${pageId} | Form ID: ${formId}`
            };

            await LeadRepository.create(newLeadData);
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }

    return res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('[Meta Webhook Error]:', error);
    return res.status(500).json({ error: error.message });
  }
};

// 3. Direct Lead Intake Endpoint (POST /api/integrations/meta-ads/leadgen)
exports.intakeDirectLead = async (req, res) => {
  try {
    const { name, email, phone, companyName, campaignName, pageId, formId } = req.body;
    const tenantId = req.tenant?.id || 'client-001';

    const newLeadData = {
      id: `LEAD-META-${Date.now()}`,
      clientId: tenantId,
      name: name || 'Meta Ads Prospect',
      companyName: companyName || 'Meta Ad Campaign Prospect',
      email: email || `meta.prospect.${Date.now().toString().slice(-4)}@example.com`,
      phone: phone || '+1-555-019-8821',
      source: 'Meta Ads',
      status: 'New',
      value: 45000,
      score: 85,
      notes: `Campaign: ${campaignName || 'FB Lead Ads'} | Page ID: ${pageId || metaConfig.pageId} | Form ID: ${formId || '4920491823901'}`
    };

    const createdLead = await LeadRepository.create(newLeadData);

    return res.status(201).json({
      success: true,
      message: 'Meta Lead ingested into CRM pipeline successfully.',
      lead: createdLead
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 4. Save/Get Meta Configuration
exports.getMetaConfig = (req, res) => {
  res.json(metaConfig);
};

exports.updateMetaConfig = (req, res) => {
  metaConfig = { ...metaConfig, ...req.body, status: 'Connected' };
  res.json({ success: true, metaConfig });
};

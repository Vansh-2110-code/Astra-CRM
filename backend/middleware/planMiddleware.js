const PLAN_LEVELS = {
  "Starter": 1,
  "Professional": 2,
  "Enterprise": 3
};

const FEATURE_PLANS = {
  // Level 1: Starter
  "leads": "Starter",
  "deals": "Starter",
  "quotes": "Starter",
  "employees": "Starter",
  "roles": "Starter",

  // Level 2: Professional
  "orders": "Professional",
  "tickets": "Professional",
  "integrations": "Professional",

  // Level 3: Enterprise
  "auditLogs": "Enterprise",
  "tenants": "Enterprise"
};

function checkFeature(featureName) {
  return (req, res, next) => {
    if (!req.tenant) {
      return res.status(400).json({ error: "Tenant context not initialized. Authentication required." });
    }

    const tenantPlan = req.tenant.plan || "Starter";
    const requiredPlan = FEATURE_PLANS[featureName];

    if (!requiredPlan) {
      // If a feature is not mapped, default to allowing it
      return next();
    }

    const tenantLevel = PLAN_LEVELS[tenantPlan] || 1;
    const requiredLevel = PLAN_LEVELS[requiredPlan] || 1;

    if (tenantLevel < requiredLevel) {
      return res.status(403).json({
        error: `Feature Lock: The '${featureName}' module is restricted. Your company is currently on the '${tenantPlan}' plan. Please upgrade to the '${requiredPlan}' plan or above to unlock this functionality.`,
        requiredPlan,
        currentPlan: tenantPlan
      });
    }

    next();
  };
}

module.exports = {
  checkFeature
};

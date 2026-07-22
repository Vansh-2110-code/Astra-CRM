# Astra CRM Enterprise SaaS Backend

A production-ready SaaS backend built for Astra CRM utilizing Node.js, Express, and local file storage simulation mapping the full multi-tenant architecture.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Run Server**:
   ```bash
   npm start
   ```
   The backend server runs locally on **`http://localhost:5000`**.

## 🛡️ Enforced Security Standards

- **Multi-Tenant Scoping**: All queries are automatically scoped by client tenant id headers.
- **Admin Access Only**: Employee profile updates (`PUT /api/employees/:id`) and RBAC matrices (`PUT /api/roles/:id`) check administrative roles.
- **Immutable Security Auditing**: Every authentication event or change in access controls logs a HIGH/INFO level record in the security audit vault.

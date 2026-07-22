# ASTRA CRM - Comprehensive System & Workflow Documentation

---

## 🌟 Executive Overview

**ASTRA CRM** is an enterprise-grade, multi-tenant Customer Relationship Management (CRM) platform designed specifically for physical and SaaS product sales. ASTRA CRM spans the entire end-to-end customer lifecycle—from lead acquisition, contact/account intelligence, multi-pipeline Kanban sales management, product matrix catalog, automated quotation engine with dynamic tax & discount math, order/invoice fulfillment, post-sales support ticketing with warranty tracking, marketing ROI telemetry, to zero-trust security control and multi-tenant client onboarding.

---

## 📐 System Architecture & Key Modules

```
                        ┌────────────────────────────────────────┐
                        │              ASTRA CRM                 │
                        │    Multi-Tenant Sales Platform         │
                        └───────────────────┬────────────────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│   CLIENT ONBOARDING   │       │   SECURITY & AUDIT    │       │     SALES ENGINE      │
│  • Multi-tenant scope │       │  • Immutable logs     │       │  • Omnichannel Leads  │
│  • Plan tier seat limit│       │  • Zero-trust RBAC    │       │  • Kanban Pipeline    │
│  • Custom branding    │       │  • 2FA & IP Whitelist │       │  • Product Catalog    │
└───────────────────────┘       └───────────────────────┘       └───────────┬───────────┘
                                                                            │
                                                                            ▼
                                                                ┌───────────────────────┐
                                                                │  QUOTATION & ORDERS   │
                                                                │  • Line-item builder  │
                                                                │  • Tax & Discount math│
                                                                │  • PDF / Print View   │
                                                                │  • Invoice generation │
                                                                └───────────────────────┘
```

---

## 🚀 End-to-End Workflow Guide

### 1. Authentication & Client Onboarding
- **Login / Signup Gateway**: Users authenticate via email & password or 2FA TOTP code. New organizations can self-serve onboard via the signup portal.
- **Tenant Scope Provisioning**: Admin users navigate to **Client Onboarding** to provision workspace subdomains (e.g. `apex.astracrm.io`), set seat limits (Starter: 10, Pro: 25, Enterprise: 50+), and choose compliance flags (GDPR, SOC2 Type II, ISO27001).
- **Tenant Switcher**: Admins can seamlessly toggle active client tenant context from the header dropdown to manage isolated datasets without data leaks.

### 2. Omnichannel Lead Acquisition & Smart Scoring
- **Intake Channels**: Leads enter from Website Forms, Social Media Ads, Email Marketing Campaigns, Referrals, or Manual Sales Entry.
- **Automated Scoring Engine**:
  ```
  Lead Score = Base (50) + Value Boost (Deal > $100k: +25) + Source Trust (Web/Referral: +15) + Email Domain (+10)
  ```
- **Duplicate Detection**: The system checks business email addresses across all records and flags potential duplicate touchpoints with a `DUP MATCH` warning.

### 3. Contact & Account 360° Profiles
- Provides a unified customer view storing contact emails, phone numbers, company domain, interaction timelines, linked quotations, and deal history.

### 4. Sales Pipeline & Kanban Management
- **Stage Progression**:
  $$ \text{Lead} \longrightarrow \text{Qualified} \longrightarrow \text{Need Analysis} \longrightarrow \text{Proposal Sent} \longrightarrow \text{Negotiation} \longrightarrow \text{Won / Lost} $$
- **Weighted Revenue Forecasting**:
  $$\text{Weighted Forecast} = \sum \left( \text{Deal Value} \times \frac{\text{Stage Probability \%}}{100} \right)$$
- **Drag-and-Drop Column Updates**: Moving a deal card to a new stage automatically recalculates the win probability matrix and updates forecasted totals.

### 5. Product Catalog & Stock Matrix
- Catalog items store SKU code, name, category, unit price, default tax rate (VAT/GST %), inventory stock counts, variant options, and downloadable technical spec sheets.

### 6. Quotation & Pricing Engine
- **Line-Item Builder**: Sales reps select catalog products, specify quantities, and set custom volume discounts.
- **Price Calculation Math**:
  $$\text{Subtotal} = \sum (\text{Unit Price} \times \text{Quantity})$$
  $$\text{Discount Amount} = \text{Subtotal} \times \left( \frac{\text{Discount \%}}{100} \right)$$
  $$\text{Tax Total} = \sum \left[ \text{Line Item After Discount} \times \left( \frac{\text{Tax Rate \%}}{100} \right) \right]$$
  $$\text{Grand Total} = (\text{Subtotal} - \text{Discount Amount}) + \text{Tax Total}$$
- **Approval Workflow**: Discounts exceeding 10% require Manager / Finance role approval.
- **PDF & Printable View**: Generates clean, branded PDF quotations ready for print or customer dispatch.

### 7. Order & Invoice Fulfillment
- **Quote-to-Order Conversion**: With one click, an accepted quote is converted to an active order (`ORD-2026-xxx`) and generates a formal invoice (`INV-2026-xxx`).
- **Fulfillment Tracking**: Tracks warehouse preparation, shipping state, and payment status (Unpaid, Partial, Paid in Full).

### 8. Post-Sales Customer Support & Warranty Desk
- **Ticket Inbox**: Log issues with High/Low priorities and SLA due timers.
- **Warranty Status Verification**: Automatically queries product catalog records to verify coverage expiration dates.
- **Knowledge Base**: Integrated resolution articles for support agents.

### 9. Marketing Hub & Campaign Telemetry
- Track Email & SMS campaigns with real-time telemetry: Open Rate %, Click Rate %, Converted Leads, and Estimated ROI %.

### 10. Security & Immutable Audit Log Vault
- **Zero-Trust RBAC**: Roles mapped across *Super Admin, Sales Manager, Executive, Support, Finance*.
- **Audit Logging**: Every sensitive action (Lead export, Quote creation, Discount approval, 2FA policy change) creates an immutable log entry storing timestamp, user, role, IP address, and event details.
- **Perimeter Security**: Enforces 2FA TOTP, session timeouts, and IP whitelisting subnet restrictions.

---

## 💻 Tech Stack & Developer Setup

- **Frontend Framework**: Vite + React 18
- **Icons**: Lucide React
- **Charts & Data Visualization**: Recharts
- **Styling & Design System**: Glassmorphism CSS with CSS Custom Variables, Dark/Light Themes
- **Local Dev Server**: `npm run dev` (Runs on `http://localhost:5173/`)
- **Production Build**: `npm run build`

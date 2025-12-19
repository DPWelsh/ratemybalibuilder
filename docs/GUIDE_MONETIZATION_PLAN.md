# RateMyBaliBuilder - Product & Monetization Plan

## Overview

RateMyBaliBuilder offers two complementary products to help people build successfully in Bali:

1. **Builder Directory** (Free) - Community-driven database of verified builder reviews and blacklist warnings
2. **Bali Investment Guide** (Premium) - Comprehensive guide to Bali real estate investment

---

## Product 1: Builder Directory (Free)

### What It Is
A searchable database of Bali builders, contractors, and tradespeople with:
- Community-verified reviews
- Blacklist warnings and scam alerts
- Status indicators (Recommended, Unknown, Flagged)
- Search by name or phone number

### Monetization
- **Free to use** - drives traffic and builds trust
- Cross-promotes the Investment Guide
- Builds email list through account creation
- Priority verification for Guide members

### Key Pages
- `/` - Homepage with search
- `/builders` - Full directory
- `/builders/[location]` - Location pages (Canggu, Ubud, etc.)
- `/find/[trade]` - Trade pages (plumber, electrician, etc.)
- `/builder/[id]` - Individual builder profiles

---

## Product 2: Bali Investment Guide (Premium)

### Content Structure (19 Chapters)

| # | Chapter | Words | Access Level |
|---|---------|-------|--------------|
| 01 | Introduction - Why Bali | 500+ | **FREE** (SEO) |
| 02 | Disclaimer | 200+ | **FREE** |
| 03 | Leasehold Land | 1,300+ | TEASER + GATED |
| 04 | Freehold Land | 1,800+ | TEASER + GATED |
| 05 | Selecting Land | 1,200+ | GATED |
| 06 | Choosing the Area | 700+ | **FREE** (SEO) |
| 07 | Land Zoning | 800+ | GATED |
| 08 | Customer Audience & Tax | 700+ | GATED |
| 09 | Calculating ROI | 2,300+ | **LEAD MAGNET** |
| 10 | Design Process | 2,900+ | GATED |
| 11 | PBG Building Permit | 800+ | GATED |
| 12 | Finding Construction Co | 1,500+ | TEASER + GATED |
| 13 | Contract with Builder | 1,800+ | GATED |
| 14 | Supervising Construction | 1,500+ | GATED |
| 15 | Interior Decorating | 1,400+ | GATED |
| 16 | Villa Management | 1,500+ | GATED |
| 17 | Selling Your Project | 1,400+ | GATED |
| 18 | Marketing | 1,800+ | GATED |
| 19 | Suppliers & Contacts | 1,400+ | **PREMIUM ONLY** |

### Access Levels

| Level | Description | Requirement |
|-------|-------------|-------------|
| FREE | Full access, indexed by search engines | None |
| TEASER | 30% preview + paywall | None |
| LEAD MAGNET | Full chapter after email capture | Email |
| GATED | Requires membership | Paid |
| PREMIUM | Highest value content | Paid (Investor tier) |

---

## User Journey Funnel

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: AWARENESS (Public)                                │
├─────────────────────────────────────────────────────────────┤
│  • Builder directory search (free)                          │
│  • Trade landing pages (/find/plumber, etc.)                │
│  • Location pages (/builders/canggu, etc.)                  │
│  • Free guide chapters (Introduction, Choosing Area)        │
│  • Teaser content (first 30% of gated chapters)             │
│  • LLM-optimized content (llms.txt)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 2: CAPTURE (Email Required)                          │
├─────────────────────────────────────────────────────────────┤
│  • Lead Magnet: "ROI Calculator Chapter"                    │
│  • Email stored in Supabase `email_subscribers` table       │
│  • Expected conversion: 5-10% of guide page visitors        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 3: CONVERT (Paid Membership)                         │
├─────────────────────────────────────────────────────────────┤
│  OPTION A: Guide Only                                       │
│  • $49 USD - One-time purchase                              │
│  • Full guide access (web + PDF)                            │
│  • All 19 chapters                                          │
│                                                             │
│  OPTION B: Investor Membership (Recommended)                │
│  • $19/month OR $149/year (save 35%)                        │
│  • Full guide access                                        │
│  • Supplier contact list (67+ contacts)                     │
│  • Priority builder verification                            │
│  • ROI calculator tool                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Pricing Structure

| Plan | Price | Includes |
|------|-------|----------|
| Free | $0 | Builder directory, 3 free chapters, teaser content |
| Guide Only | $49 one-time | All 19 chapters (web + PDF) |
| Investor Monthly | $19/month | Guide + supplier contacts + priority verification |
| Investor Yearly | $149/year | Same as monthly, save 35% |

---

## Database Schema

### Existing Tables
- `profiles` - User accounts
- `builders` - Builder directory
- `reviews` - Builder reviews

### New/Updated Tables

```sql
-- Email subscribers (lead magnet captures)
CREATE TABLE public.email_subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'guide',
  lead_magnet text,
  subscribed_at timestamp with time zone DEFAULT now(),
  unsubscribed_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'
);

-- Memberships (Stripe integration)
CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  plan text NOT NULL, -- 'guide_only', 'investor_monthly', 'investor_yearly'
  status text NOT NULL DEFAULT 'active',
  stripe_subscription_id text,
  stripe_customer_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  cancelled_at timestamp with time zone
);

-- Update profiles table
ALTER TABLE public.profiles
ADD COLUMN membership_tier text DEFAULT 'free',
ADD COLUMN stripe_customer_id text;
```

---

## URL Structure

```
# Builder Directory (Free)
/                               → Homepage with search
/builders                       → Full directory
/builders/[location]            → Location pages
/find/[trade]                   → Trade pages
/builder/[id]                   → Builder profile

# Investment Guide
/guide                          → Guide landing page
/guide/introduction             → Free chapter
/guide/choosing-the-area        → Free chapter
/guide/leasehold-land           → Teaser + paywall
/guide/calculating-roi          → Lead magnet (email)
/guide/[chapter]                → Paywall (membership)
/guide/suppliers                → Premium only

# Account & Payments
/pricing                        → Pricing page
/checkout                       → Stripe checkout
/account                        → Account settings
/account/membership             → Manage subscription
```

---

## Stripe Integration

### Products to Create

| Product | Price | Type |
|---------|-------|------|
| Bali Investment Guide | $49 | One-time |
| Investor Membership Monthly | $19/mo | Subscription |
| Investor Membership Yearly | $149/yr | Subscription |

### Webhook Events

- `checkout.session.completed` - Grant access
- `customer.subscription.updated` - Update status
- `customer.subscription.deleted` - Revoke access
- `invoice.payment_failed` - Send warning

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Guide page views | 1,000+/month |
| Email capture rate | 5-10% |
| Email → Member conversion | 2-5% |
| Monthly recurring revenue | $500+ |
| Churn rate | <10% |

---

## Key Principles

1. **Builder Directory is free forever** - This drives traffic and builds trust
2. **Supplier contacts are the crown jewel** - Keep them premium-only
3. **ROI chapter is the best lead magnet** - Actionable and leads to "I need a builder"
4. **Cross-promote naturally** - Guide mentions directory, directory promotes guide
5. **Free content must be genuinely useful** - Builds trust and SEO value

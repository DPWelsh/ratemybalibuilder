# Invest in Bali Guide - Monetization Implementation Plan

## Overview

Transform the 85-page "Invest in Bali Guide" into a revenue-generating membership product while maximizing user acquisition through strategic free content.

---

## Content Structure

### What We Have (19,000+ words)

| # | Chapter | Words | Monetization |
|---|---------|-------|--------------|
| 01 | Introduction - Why Bali | 531 | FREE (SEO) |
| 02 | Disclaimer | 84 | FREE |
| 03 | Leasehold Land | 1,361 | TEASER + GATED |
| 04 | Freehold Land | 1,818 | TEASER + GATED |
| 05 | Selecting Land | 1,288 | GATED |
| 06 | Choosing the Area | 700 | FREE (SEO) |
| 07 | Land Zoning | 852 | GATED |
| 08 | Customer Audience & Tax | 700 | GATED |
| 09 | Calculating ROI | 2,380 | **LEAD MAGNET** |
| 10 | Design Process | 2,926 | GATED |
| 11 | PBG Building Permit | 330 | GATED |
| 12 | Finding Construction Co | 784 | TEASER + GATED |
| 13 | Contract with Builder | 242 | GATED |
| 14 | Supervising Construction | 500 | GATED |
| 15 | Interior Decorating | 686 | GATED |
| 16 | Villa Management | 496 | GATED |
| 17 | Selling Your Project | 240 | GATED |
| 18 | Marketing | 1,996 | GATED |
| 19 | Suppliers & Contacts | 1,441 | **PREMIUM ONLY** |

---

## User Journey Funnel

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: AWARENESS (Public - No Login)                     │
├─────────────────────────────────────────────────────────────┤
│  • Trade landing pages (/find/plumber, etc.) ✓ DONE         │
│  • Location pages (/builders/canggu, etc.) ✓ DONE           │
│  • Free guide chapters (Why Bali, Choosing Area)            │
│  • Teaser content (first 30% of gated chapters)             │
│  • All content indexed by Google & cited by LLMs            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 2: CAPTURE (Email Required)                          │
├─────────────────────────────────────────────────────────────┤
│  • Lead Magnet: "ROI Calculator Chapter" (2,380 words)      │
│  • Popup/banner on guide pages: "Get the full chapter"      │
│  • Email stored in Supabase `email_subscribers` table       │
│  • Triggers welcome email with PDF download link            │
│  • Expected conversion: 5-10% of guide page visitors        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 3: NURTURE (Email Sequence)                          │
├─────────────────────────────────────────────────────────────┤
│  • Day 0: ROI Chapter PDF + welcome                         │
│  • Day 2: "5 Biggest Mistakes Investors Make" (teaser)      │
│  • Day 5: "Why Supplier Contacts Save You 40%" (teaser)     │
│  • Day 7: Membership offer (limited discount?)              │
│  • Ongoing: Monthly Bali market updates                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 4: CONVERT (Paid Membership)                         │
├─────────────────────────────────────────────────────────────┤
│  OPTION A: One-Time Purchase                                │
│  • $49 USD - Full guide PDF download                        │
│  • Instant access, no recurring                             │
│                                                             │
│  OPTION B: Investor Membership (Recommended)                │
│  • $19/month OR $149/year (save 35%)                        │
│  • Full guide access (web + PDF)                            │
│  • Supplier contact list (67 contacts!)                     │
│  • Contract templates                                       │
│  • ROI calculator tool                                      │
│  • Priority builder verification requests                   │
│  • Monthly market updates                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema Changes

### New Tables

```sql
-- Email subscribers (lead magnet captures)
CREATE TABLE public.email_subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'guide', -- 'guide', 'homepage', 'trade-page'
  lead_magnet text, -- 'roi-chapter', 'checklist', etc.
  subscribed_at timestamp with time zone DEFAULT now(),
  unsubscribed_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'
);

-- Guide access tracking
CREATE TABLE public.guide_access (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  email text, -- for non-logged-in lead magnet access
  chapter_slug text NOT NULL,
  accessed_at timestamp with time zone DEFAULT now()
);

-- Memberships
CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  plan text NOT NULL, -- 'guide_only', 'investor_monthly', 'investor_yearly'
  status text NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  stripe_subscription_id text,
  stripe_customer_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  cancelled_at timestamp with time zone
);

-- Update profiles table
ALTER TABLE public.profiles
ADD COLUMN membership_tier text DEFAULT 'free', -- 'free', 'guide', 'investor'
ADD COLUMN stripe_customer_id text;
```

---

## URL Structure

```
/guide                          → Guide landing page (free)
/guide/introduction             → Free chapter
/guide/choosing-the-area        → Free chapter
/guide/leasehold-land           → Teaser (30%) + paywall
/guide/freehold-land            → Teaser (30%) + paywall
/guide/calculating-roi          → Lead magnet (email-gated)
/guide/[chapter]                → Paywall (membership required)
/guide/suppliers                → Premium only (high value)

/pricing                        → Membership pricing page
/checkout                       → Stripe checkout
/account/membership             → Manage subscription
```

---

## Component Architecture

### 1. Guide Chapter Page (`/guide/[chapter]/page.tsx`)

```tsx
// Pseudo-code structure
export default function ChapterPage({ chapter }) {
  const user = useUser();
  const membership = useMembership();

  // Determine access level
  const accessLevel = getAccessLevel(chapter, user, membership);

  if (accessLevel === 'full') {
    return <FullChapter content={chapter.content} />;
  }

  if (accessLevel === 'lead-magnet') {
    return <LeadMagnetGate chapter={chapter} />;
  }

  if (accessLevel === 'teaser') {
    return (
      <>
        <TeaserContent content={chapter.teaser} />
        <PaywallCTA membership={membership} />
      </>
    );
  }

  return <PaywallCTA membership={membership} />;
}
```

### 2. Lead Magnet Component

```tsx
// Email capture modal/inline form
function LeadMagnetGate({ chapter }) {
  const [email, setEmail] = useState('');

  async function handleSubmit() {
    // 1. Save to email_subscribers table
    // 2. Grant temporary access to chapter
    // 3. Trigger email with PDF link
    // 4. Show success + content
  }

  return (
    <Card>
      <h2>Get the Full "{chapter.title}" Chapter Free</h2>
      <p>Enter your email to unlock this chapter + get our ROI calculator</p>
      <Input type="email" value={email} onChange={...} />
      <Button>Send Me the Chapter</Button>
      <p className="text-sm">No spam. Unsubscribe anytime.</p>
    </Card>
  );
}
```

### 3. Paywall Component

```tsx
function PaywallCTA({ teaser }) {
  return (
    <div className="relative">
      {/* Blurred preview of remaining content */}
      <div className="blur-sm opacity-50 pointer-events-none">
        {teaser && <div dangerouslySetInnerHTML={{ __html: teaser }} />}
      </div>

      {/* Overlay CTA */}
      <Card className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h3>Unlock the Full Guide</h3>
          <p>Get all 19 chapters + supplier contacts</p>
          <div className="flex gap-4">
            <Button href="/pricing">See Plans</Button>
            <Button variant="outline" href="/guide/calculating-roi">
              Try Free Chapter First
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

---

## Stripe Integration

### Products to Create in Stripe Dashboard

| Product | Price | Type |
|---------|-------|------|
| Bali Guide - One Time | $49 | One-time |
| Investor Membership - Monthly | $19/mo | Subscription |
| Investor Membership - Yearly | $149/yr | Subscription |

### Webhook Events to Handle

```typescript
// /api/webhooks/stripe/route.ts

switch (event.type) {
  case 'checkout.session.completed':
    // Create/update membership in database
    // Grant access to guide
    break;

  case 'customer.subscription.updated':
    // Update membership status
    break;

  case 'customer.subscription.deleted':
    // Revoke access, update status to 'cancelled'
    break;

  case 'invoice.payment_failed':
    // Send warning email, maybe grace period
    break;
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Create database tables (email_subscribers, memberships)
- [ ] Create `/guide` landing page
- [ ] Create guide chapter data structure (markdown files or DB)
- [ ] Create 2-3 free chapters
- [ ] Basic chapter page with no paywall

### Phase 2: Lead Magnet (Week 1-2)
- [ ] Create email capture component
- [ ] Set up email_subscribers table + API
- [ ] Create ROI chapter as lead magnet
- [ ] Add lead magnet gate to ROI chapter page
- [ ] Test email capture flow

### Phase 3: Paywall (Week 2)
- [ ] Create PaywallCTA component
- [ ] Add teaser content extraction logic
- [ ] Gate remaining chapters behind paywall
- [ ] Create `/pricing` page

### Phase 4: Stripe Integration (Week 2-3)
- [ ] Create Stripe products + prices
- [ ] Build checkout flow
- [ ] Implement webhook handlers
- [ ] Create membership management in `/account`
- [ ] Test purchase flow end-to-end

### Phase 5: Polish (Week 3)
- [ ] Add membership badge to header
- [ ] Create PDF download for members
- [ ] Add supplier contacts page (premium)
- [ ] Analytics: track conversions
- [ ] Email sequences (if using email service)

---

## Success Metrics

| Metric | Target | How to Track |
|--------|--------|--------------|
| Guide page views | 1000/mo | Analytics |
| Email capture rate | 5-10% | email_subscribers / page views |
| Email → Member conversion | 2-5% | memberships / email_subscribers |
| Direct conversion (no email) | 1-2% | memberships / page views |
| Monthly recurring revenue | $500+ | Stripe dashboard |
| Churn rate | <10% | Cancelled / total members |

---

## Content Files Structure

```
/content/guide/
├── chapters.json           # Chapter metadata + order
├── 01-introduction.md      # Free
├── 02-why-bali.md          # Free
├── 03-leasehold-land.md    # Teaser + gated
├── 04-freehold-land.md     # Teaser + gated
├── 05-selecting-land.md    # Gated
├── 06-choosing-area.md     # Free (SEO value)
├── 07-land-zoning.md       # Gated
├── 08-customer-audience.md # Gated
├── 09-calculating-roi.md   # Lead magnet
├── 10-design-process.md    # Gated
├── 11-building-permit.md   # Gated
├── 12-finding-builder.md   # Teaser + gated
├── 13-contracts.md         # Gated
├── 14-supervising.md       # Gated
├── 15-interior.md          # Gated
├── 16-villa-management.md  # Gated
├── 17-selling.md           # Gated
├── 18-marketing.md         # Gated
└── 19-suppliers.md         # Premium only
```

---

## Quick Start Commands

```bash
# 1. Run database migrations
npx supabase db push

# 2. Create Stripe products (do in dashboard or CLI)
stripe products create --name="Bali Investment Guide"
stripe prices create --product=prod_xxx --unit-amount=4900 --currency=usd

# 3. Add webhook endpoint in Stripe dashboard
# URL: https://ratemybalibuilder.com/api/webhooks/stripe

# 4. Test locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Notes

- **Supplier contacts are the crown jewel** - These alone justify the membership price. Keep them premium-only.
- **ROI calculator chapter is the best lead magnet** - It's actionable, valuable, and naturally leads to "I need to find a builder" (your core product).
- **Free content must be genuinely useful** - It builds trust and gets indexed by search engines + LLMs.
- **Consider annual discount** - 35% off ($149 vs $228) incentivizes commitment and reduces churn.

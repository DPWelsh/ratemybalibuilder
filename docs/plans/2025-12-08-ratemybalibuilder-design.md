# RateMyBaliBuilder - Design Document

## Overview

**RateMyBaliBuilder** - A paid search database for vetting Bali builders.

**Problem:** Expats building in Bali have no reliable way to check if a builder is legit. Horror stories of deposits vanishing, shoddy work, abandoned projects.

**Solution:** A curated database of builders with traffic-light ratings:
- 🔴 **Blacklisted** - Known problems, avoid
- 🟡 **Unknown** - No data yet
- 🟢 **Recommended** - Verified good reputation

## Revenue Model

| Action | Price |
|--------|-------|
| Search (basic) | $10 |
| Unlock full details | $20 |
| Submit a review | +$20 credit reward |
| Credit pack | $50 |

## Bootstrap Strategy

Seed the database with existing blacklist + manually collected recommendations. User-submitted reviews grow it organically.

---

## User Flows

### Flow 1: Searching for a builder

1. User lands on homepage
2. Enters builder name + phone number
3. Prompted to pay $10 (or use credits)
4. After payment → sees result:
   - Traffic light status (🔴/🟡/🟢)
   - Number of reviews on file
   - "Unlock full details for $20" button
5. If they pay $20 → sees full reviews, photos, red flags, notes

### Flow 2: Submitting a review

1. User clicks "Submit a Review"
2. Fills form: builder name, phone, rating, written review, optional photos
3. Submits → goes to admin queue for approval
4. Once approved → user gets $20 credit added to their account
5. Credit can be used for searches or unlocks

### Flow 3: Buying credits

1. User clicks "Buy Credits"
2. Pays $50 via Xendit/DOKU
3. $50 added to their account balance
4. Balance deducts as they search ($10) or unlock ($20)

### Flow 4: Admin moderation

1. Admin logs into admin dashboard
2. See pending reviews
3. Approve (adds to database, credits user) or reject (notify user why)
4. Can manually add/edit builders, update blacklist

---

## Data Model

### Users
- id, email, password (Supabase Auth)
- credit_balance (integer, in dollars)
- created_at

### Builders
- id
- name (text)
- phone (text, primary identifier)
- aliases (text array - other names they go by)
- status (enum: blacklisted / unknown / recommended)
- company_name (optional)
- instagram (optional)
- notes (admin-only internal notes)
- created_at, updated_at

### Reviews
- id
- builder_id (foreign key)
- user_id (who submitted)
- rating (1-5 stars)
- review_text
- photos (array of URLs)
- status (enum: pending / approved / rejected)
- admin_notes (why rejected, if applicable)
- created_at

### Transactions
- id
- user_id
- type (enum: search / unlock / credit_purchase / review_reward)
- amount (positive for credits added, negative for spent)
- builder_id (if search/unlock)
- created_at

### Searches
- id
- user_id
- builder_id
- level (enum: basic / full)
- created_at

---

## Pages & Components

### Public pages
- `/` - Homepage with search bar, value prop, "How it works"
- `/login` - Sign in / sign up (Supabase Auth)
- `/search` - Search form (name + phone), requires auth
- `/builder/[id]` - Builder result page (gated by payment)
- `/submit-review` - Review submission form, requires auth
- `/buy-credits` - Credit purchase page with Xendit/DOKU
- `/account` - User's credit balance, search history, submitted reviews

### Admin pages (protected)
- `/admin` - Dashboard overview
- `/admin/reviews` - Pending reviews queue
- `/admin/builders` - Add/edit/manage builders
- `/admin/users` - View users and balances

### Key components
- `SearchForm` - Name + phone input
- `BuilderCard` - Traffic light, review count, unlock button
- `ReviewForm` - Rating stars, text, photo upload
- `CreditBalance` - Shows current balance, buy more link
- `PaymentModal` - Xendit/DOKU checkout flow

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS for styling
- Deployed on Vercel

### Backend
- Next.js API routes (or Server Actions)
- Supabase for database + auth
- Row-level security for user data protection

### Payments
- Xendit or DOKU
- Webhook to credit user balance after successful payment

### File storage
- Supabase Storage for review photos

### Domain
- ratemybalibuilder.com → Vercel

---

## Launch Plan

### Phase 1: Seed the database
- Import existing blacklist
- Manually add 20-30 recommended builders from network
- Ensure enough data that early searches return results

### Phase 2: Soft launch
- Share in 2-3 Bali expat Facebook groups
- Offer first 50 users a free search (promo code)
- Gather feedback, fix bugs

### Phase 3: Review collection push
- Post asking people to submit reviews of builders they've used
- $20 credit incentive drives submissions
- Each review grows the database

### Phase 4: Paid marketing (optional, later)
- Facebook/Instagram ads targeting Bali expats
- Google Ads for "Bali builder reviews" keywords
- Only after organic traction proves demand

---

## Success Metrics

- Searches per week
- Conversion rate: search → unlock
- Reviews submitted per week
- Credit purchases

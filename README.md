# RateMyBaliBuilder

A paid search database for vetting Bali builders. Help expats avoid construction horror stories.

## 🚨 The Problem

Expats building in Bali have no reliable way to check if a builder is legit. Horror stories include:
- Deposits vanishing
- Shoddy work
- Abandoned projects
- No accountability

## ✅ The Solution

A curated database of builders with traffic-light ratings:
- 🔴 **Blacklisted** - Known problems, avoid at all costs
- 🟡 **Unknown** - No data yet, proceed with caution
- 🟢 **Recommended** - Verified good reputation

## 💰 Revenue Model

| Action | Price |
|--------|-------|
| Basic search | $10 |
| Unlock full details | $20 |
| Submit a review | +$20 credit reward |
| Credit pack | $50 |

## 🎯 Market Opportunity

- **250,000+** long-term expats in Bali
- **6-8 million** tourists/year
- **$3-5 billion/year** real estate industry
- **Zero dominant competition** in this space

Target: 15,000-50,000 active users in 12-24 months

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend:** Next.js API routes, Supabase (PostgreSQL + Auth)
- **Payments:** Xendit/DOKU (Indonesia-friendly)
- **Storage:** Supabase Storage (review photos)
- **Deployment:** Vercel

## 🚀 Quick Start

1. Clone the repo:
```bash
git clone https://github.com/yourusername/ratemybalibuilder.git
cd ratemybalibuilder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Set up the database:
```bash
# Run the schema in your Supabase SQL editor
cat supabase/schema.sql
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── (auth)/       # Login/signup
│   │   ├── admin/        # Admin dashboard
│   │   ├── search/       # Search for builders
│   │   ├── submit-review/# Submit reviews
│   │   └── account/      # User account & credits
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   │   └── supabase/     # Supabase clients
│   └── types/            # TypeScript types
├── supabase/
│   └── schema.sql        # Database schema
├── docs/
│   └── plans/            # Design docs
└── public/               # Static assets
```

## 📊 Key Features

### For Users
- Search builders by name/phone
- Traffic light rating system
- Submit reviews for $20 credit
- Buy credit packs
- View search history

### For Admins
- Approve/reject reviews
- Manage builders database
- Add to blacklist
- View user transactions

## 🎯 Launch Strategy

### Phase 1: Seed the database (Week 1-2)
- Import existing blacklist
- Manually add 20-30 recommended builders
- Ensure search results show data

### Phase 2: Soft launch (Week 3-4)
- Post in 2-3 Bali expat Facebook groups
- Offer first 50 users a free search
- Gather feedback, fix bugs

### Phase 3: Review collection (Week 5-8)
- Incentivize review submissions ($20 credit)
- Post regularly in expat groups
- Grow database organically

### Phase 4: Scale (Month 3+)
- Facebook/Instagram ads
- Google Ads ("Bali builder reviews")
- SEO optimization

## 📈 Success Metrics

- Searches per week
- Search → unlock conversion rate
- Reviews submitted per week
- Credit purchases
- Monthly recurring revenue

## 🔒 Security

- Supabase Row Level Security (RLS) enabled
- Auth required for all actions
- Admin routes protected
- Payment webhooks verified

## 📄 License

MIT License - See LICENSE file for details

## 💡 Contributing

Not accepting contributions yet (pre-launch). After launch, open to PRs for:
- Bug fixes
- Performance improvements
- New payment integrations

## 📞 Contact

Questions? Contact: [your email]

---

**Built to solve a real problem in Bali's construction industry.**

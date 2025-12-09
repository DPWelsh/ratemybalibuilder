# Data Collection & Growth Tasks

## 2-Week Sprint Plan

---

## Tech Tasks (Daniel)

### 1. Data Scrape - Builder Database
**Goal:** Upload 200+ builder contacts to Supabase

**Sources:**
- [ ] Google Maps: Search "Builder Bali", "Contractor Bali", "Villa Builder Canggu", etc.
- [ ] Facebook: Builder groups, contractor pages
- [ ] Instagram: #balibuilder #balivilla hashtags

**Data to collect per builder:**
- Name / Company name
- Phone / WhatsApp (required)
- Location (Canggu, Ubud, Seminyak, etc.)
- Trade type (General Contractor, Pool Builder, etc.)
- Source URL
- Any reviews/ratings found

**Script:** See `scrape-google-maps.js` and `upload-to-supabase.js`

---

### 2. SEO Landing Pages
**Goal:** Rank for location-specific searches

Create pages for:
- [ ] `/builder/canggu` - "Builders in Canggu"
- [ ] `/builder/ubud` - "Builders in Ubud"
- [ ] `/builder/seminyak` - "Builders in Seminyak"
- [ ] `/builder/uluwatu` - "Builders in Uluwatu"

Each page should have:
- H1: "Find Trusted Builders in [Location]"
- Search form (phone only)
- List of builders in that area
- FAQ section for SEO

---

### 3. Analytics Setup
**Goal:** Track user behavior and drop-off points

Options:
- [ ] PostHog (privacy-friendly, free tier)
- [ ] Google Analytics 4
- [ ] Vercel Analytics (simple, built-in)

Key events to track:
- Homepage visits
- Search attempts
- Search results viewed
- Signup clicks
- Signup completions
- Unlock attempts

---

## Non-Tech Tasks (Partner)

### 1. The "Honey Pot" Strategy
**Goal:** Collect horror stories + build user base

**Post in Facebook Groups:**
- Bali Expats
- Canggu Community
- Ubud Community
- Bali Property / Real Estate groups
- Digital Nomads Bali

**Template post:**
```
I'm building a blacklist of bad builders in Bali.

If you've had a horror story with a contractor - delays,
overcharging, disappeared mid-project - DM me.

Your experience could save someone else $50k.
```

**Track responses in:** `responses.csv`

---

### 2. Builder Outreach (FOMO)
**Goal:** Get builders to "claim" their profile

WhatsApp 20 builders from scraped list:

**Template:**
```
Hi [Name],

We have people searching for you on RateMyBaliBuilder.com

You can claim your profile to see reviews and respond to feedback:
[link]

- RateMyBaliBuilder Team
```

**Track in:** `outreach-log.csv`

---

### 3. Content Creation
**Goal:** Build Instagram presence

Ideas:
- [ ] Photo of bad construction work: "Don't let this happen to you"
- [ ] Photo of good work: "This is what quality looks like"
- [ ] Before/after renovation
- [ ] "Red flags to watch for" carousel
- [ ] "Questions to ask your builder" tips

**Post to:**
- Instagram @ratemybalibuilder
- Facebook page
- TikTok (optional)

---

## Files in this folder

- `TASKS.md` - This file
- `builders-template.csv` - Template for builder data
- `responses.csv` - Track FB group responses
- `outreach-log.csv` - Track builder outreach
- `scrape-google-maps.js` - Scraping script (manual)
- `upload-to-supabase.js` - Upload script

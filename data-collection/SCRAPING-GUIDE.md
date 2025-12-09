# Manual Scraping Guide

## Google Maps Scraping

Since Google Maps blocks automated scraping, here's the manual process:

### Search Terms to Use
1. "Builder Bali"
2. "Contractor Bali"
3. "Villa Builder Canggu"
4. "Villa Builder Ubud"
5. "Pool Builder Bali"
6. "Renovation Bali"
7. "Construction Company Bali"
8. "Architect Bali"

### For Each Result, Collect:
- Business name
- Phone number (click to reveal)
- Address/Location
- Google rating
- Number of reviews
- Website (if available)

### Tools to Speed Up
1. **Google Maps Extractor** (Chrome Extension)
   - Search "Google Maps Extractor" in Chrome Web Store
   - Exports results to CSV

2. **Instant Data Scraper** (Chrome Extension)
   - Auto-detects tables/lists on pages
   - One-click export

---

## Facebook Scraping

### Groups to Search
- "Bali Expats"
- "Canggu Community"
- "Ubud Community"
- "Bali Property"
- "Building in Bali"

### What to Look For
- People recommending builders
- People complaining about builders
- Builder business pages

### Collect From Posts:
- Builder name mentioned
- Phone/WhatsApp if shared
- Positive or negative sentiment
- Date of post

---

## Instagram Scraping

### Hashtags to Search
- #balibuilder
- #balivilla
- #balicontractor
- #baliconstruction
- #canggubuilder

### Look For
- Builder business accounts
- Contact info in bio
- WhatsApp links

---

## Data Entry

1. Add all collected data to `builders.csv`
2. Run `node upload-to-supabase.js` to upload

### CSV Format
```csv
name,phone,company_name,location,trade_type,source_url,notes
"Wayan Builders","+62 812 3456 7890","PT Wayan","Canggu","General Contractor","https://maps.google.com/...","4.5 stars on Google"
```

---

## Tips

1. **Prioritize phone numbers** - That's our primary search key
2. **Note the source** - Helps verify legitimacy later
3. **Check for duplicates** - Same builder might appear in multiple places
4. **Flag red flags** - If you see complaints, note them

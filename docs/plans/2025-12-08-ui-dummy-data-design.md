# RateMyBaliBuilder UI & Dummy Data Design

## Overview

Build the user-facing pages with dummy data to simulate the full search → unlock → view flow. Payment integration comes later.

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/search?name=X&phone=Y` | Search results (teaser cards) |
| `/builder/[id]` | Builder profile (locked state) |
| `/builder/[id]?unlocked=1` | Builder profile (full details) |
| `/submit-review` | Submit a review form |

### Search Results Page (`/search`)

- Shows matching builders as cards
- Each card: name, phone (masked), status badge, review count
- "Unlock Full Details - $20" button on each
- "No results found" state with option to submit a review for unknown builder

### Builder Profile Page (`/builder/[id]`)

**Locked state:**
- Status badge, name, masked phone, review count
- Blurred/hidden reviews
- "Unlock for $20" CTA sticky at bottom

**Unlocked state:**
- Full phone, WhatsApp link, Instagram
- Company name
- All reviews with photos
- Red flags summary (for blacklisted builders)

### Submit Review Page (`/submit-review`)

- Builder name + phone input (or select existing)
- 1-5 star rating
- Review text (min 50 chars)
- Photo upload (up to 5)
- Submit → success message about $20 credit reward

## Dummy Data Structure

### Builders (8 total)

| Status | Count | Description |
|--------|-------|-------------|
| Recommended | 3 | Reliable builders with 4-5 star reviews |
| Unknown | 3 | New/few reviews, mixed ratings |
| Blacklisted | 2 | Multiple complaints, red flags |

**Builder fields:**
- id, name, phone, companyName, instagram, status, createdAt

### Reviews (25-30 total)

**Scenarios covered:**
- Villa builds ($50k-200k range)
- Pool installations
- Renovations
- Timeframe issues ("took 8 months instead of 4")
- Red flags ("asked for 80% upfront", "subcontracted without telling us")
- Positive signals ("stayed on budget", "fixed issues quickly")

**Review fields:**
- id, builderId, rating (1-5), text, photos[], createdAt

## Component Structure

### Search Results Page
```
/search/page.tsx
├── SearchHeader        - Shows search query, result count
├── BuilderCard[]       - List of matching builders
│   ├── StatusBadge
│   ├── MaskedPhone     - Shows "+62 812 XXX XXXX"
│   └── UnlockButton
└── NoResults           - Empty state with "Submit a review" CTA
```

### Builder Profile Page
```
/builder/[id]/page.tsx
├── BuilderHeader       - Name, status badge, company
├── ContactSection      - Phone, WhatsApp button, Instagram link
├── StatsBar            - Average rating, review count
├── ReviewsList
│   └── ReviewCard[]
│       ├── StarRating
│       ├── ReviewText
│       ├── ReviewPhotos
│       └── ReviewMeta
├── RedFlagsSection     - Only for blacklisted builders
└── UnlockCTA           - Sticky bottom bar when locked
```

### Submit Review Page
```
/submit-review/page.tsx
├── BuilderSearch       - Autocomplete or manual entry
├── StarRatingInput     - Clickable 1-5 stars
├── ReviewTextArea
├── PhotoUpload
└── SubmitButton
```

## Unlock Simulation Logic

**URL-based state:**
- `/builder/abc123` → Locked view
- `/builder/abc123?unlocked=1` → Unlocked view

**Locked behavior:**
- Phone masked: `+62 812 •••• ••••`
- Reviews blurred/hidden
- Sticky "Unlock for $20" button
- Click → redirect to `?unlocked=1`

**Unlocked behavior:**
- Full phone visible
- WhatsApp button (`https://wa.me/62812...`)
- Instagram link
- All reviews visible
- No unlock CTA

**Demo mode:**
- No login required
- Toast shows "Demo mode - normally costs $20" on unlock
- Easy to demo full flow

## Data File Structure

```
/src/lib/dummy-data.ts
├── builders[]
├── reviews[]
└── helper functions
    ├── getBuilderById(id)
    ├── searchBuilders(name?, phone?)
    ├── getReviewsForBuilder(builderId)
    └── getAverageRating(builderId)
```

## New Components Needed

- `StarRating` - Display and input versions
- `ReviewCard` - Individual review display
- `PhotoGallery` - Review photos with lightbox
- `MaskedPhone` - Shows masked or full phone
- `RedFlagsSection` - Summary of issues
- `UnlockCTA` - Sticky bottom unlock bar

## Reused Components

- `StatusBadge`
- `BuilderCard`
- `Button`, `Card`, `Input` (shadcn)

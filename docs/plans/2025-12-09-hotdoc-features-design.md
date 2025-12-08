# HotDoc-Inspired Features Design

Date: 2025-12-09

## Overview

Implement 4 features inspired by HotDoc to improve user experience and engagement.

---

## Feature 1: Smart Search Filters

### Location Options
- Canggu, Seminyak, Ubud, Uluwatu, Sanur, Denpasar, Tabanan
- Default: "All Areas"

### Filter Types
- **Location**: Dropdown, exact match
- **Trade Type**: Dropdown, exact match (General Contractor, Pool Builder, Architect, etc.)
- **Project Type**: Dropdown, includes match (Villas, Renovations, Pools, etc.)

### UI
- Horizontal filter bar above AG Grid on `/builders`
- Uses shadcn Select components
- Mobile: Stack vertically
- "Clear" button resets all filters
- Filters combine with AND logic

### Data Changes
- Add `location: Location` field to Builder interface
- Add location to all 8 dummy builders

---

## Feature 2: Trust Signals

### Stats to Display
- "X Builders Vetted" (count of builders)
- "X Reviews Submitted" (count of reviews)
- "X Expats Protected" (seed with ~500, later track unlocks)

### Placement
1. **Homepage Hero** - Large stats below headline
2. **Header** (optional) - Small text near logo
3. **Footer** - Repeat for credibility

### Component
- `TrustStats` component
- Pull counts from dummy data (later: Supabase)

---

## Feature 3: Review Prompts

### When to Prompt
- After user unlocks a builder
- On Dashboard for unlocked-but-not-reviewed builders

### UI
- Banner on builder profile after unlock
- Card on Dashboard showing "Builders you've unlocked"
- CTA: "Leave a review and earn $20 credit"

### Data Needed
- Track unlocked builders per user (`unlocks` array/table)
- Check if user already reviewed that builder
- Show prompt only for unlocked + not-yet-reviewed

---

## Feature 4: My Builders (Saved List)

### How It Works
- Heart/bookmark icon on builder cards and profiles
- Click to save/unsave
- View saved builders on Dashboard

### UI Elements
- Empty heart = not saved, filled = saved
- Dashboard section: "My Saved Builders" with list

### Data
- `savedBuilders` array in user profile
- For now: localStorage as dummy implementation

---

## Implementation Order

1. Smart Search Filters (core functionality)
2. Trust Signals (quick win)
3. Review Prompts (grows database)
4. My Builders (nice-to-have)

---

## Files to Create/Modify

### New Files
- `src/components/FilterBar.tsx`
- `src/components/TrustStats.tsx`
- `src/components/ReviewPrompt.tsx`
- `src/components/SaveBuilderButton.tsx`

### Modified Files
- `src/lib/dummy-data.ts` - Add Location type and location field
- `src/app/builders/page.tsx` - Add FilterBar
- `src/app/page.tsx` - Add TrustStats to hero
- `src/app/builder/[id]/page.tsx` - Add ReviewPrompt, SaveBuilderButton
- `src/app/dashboard/page.tsx` - Add My Builders section, Review prompts
- `src/components/ui/select.tsx` - Add shadcn Select component

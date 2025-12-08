# Deployment Guide

## Prerequisites

1. **Supabase Project**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema: `supabase/schema.sql`
   - Enable Row Level Security (RLS) policies
   - Get your API keys from Settings → API

2. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub account

3. **Payment Provider**
   - Sign up for [Xendit](https://xendit.co) or [DOKU](https://doku.com)
   - Get API keys and webhook secrets

## Environment Variables

Set these in Vercel dashboard:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Payment
XENDIT_API_KEY=xnd_xxx...
XENDIT_WEBHOOK_SECRET=whsec_xxx...

# App
NEXT_PUBLIC_APP_URL=https://ratemybalibuilder.com
ADMIN_EMAIL=your@email.com
```

## Deploy to Vercel

### Option 1: Auto Deploy (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo: `DPWelsh/ratemybalibuilder`
3. Add environment variables
4. Click "Deploy"

### Option 2: CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Post-Deployment Setup

### 1. Configure Supabase Auth Redirect

In Supabase dashboard → Authentication → URL Configuration:

- **Site URL:** `https://ratemybalibuilder.com`
- **Redirect URLs:** 
  - `https://ratemybalibuilder.com/auth/callback`
  - `http://localhost:3000/auth/callback` (for local dev)

### 2. Set Up Payment Webhooks

**Xendit:**
- Dashboard → Settings → Webhooks
- Add webhook URL: `https://ratemybalibuilder.com/api/webhooks/xendit`
- Select events: `payment.paid`, `payment.failed`

### 3. Create Admin User

```sql
-- In Supabase SQL Editor
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@ratemybalibuilder.com', crypt('your-password', gen_salt('bf')), now());

-- Get the user_id from above insert, then:
INSERT INTO users (id, email, credit_balance, is_admin)
VALUES ('user-id-from-above', 'admin@ratemybalibuilder.com', 0, true);
```

### 4. Seed Initial Data

Add some builders to test:

```sql
-- Add a recommended builder
INSERT INTO builders (name, phone, status, company_name)
VALUES ('Pak Wayan', '+62812345678', 'recommended', 'Bali Build Co');

-- Add a blacklisted builder (from known issues)
INSERT INTO builders (name, phone, status, notes)
VALUES ('Scam Builder', '+62898765432', 'blacklisted', 'Multiple complaints about vanishing deposits');
```

## Monitoring

### Vercel Analytics
- Automatically enabled in Vercel dashboard
- View traffic, performance, errors

### Supabase Logs
- Dashboard → Database → Logs
- Monitor auth attempts, queries, errors

### Payment Webhook Logs
- Xendit Dashboard → Webhooks → Logs
- Verify successful payment processing

## Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add `ratemybalibuilder.com`
3. Update DNS records at your registrar:
   - Type: `A` Record
   - Name: `@`
   - Value: `76.76.21.21`
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

## Troubleshooting

### Build Fails
- Check Node version (should be 20+)
- Verify all env vars are set
- Check build logs in Vercel dashboard

### Auth Not Working
- Verify Supabase redirect URLs
- Check NEXT_PUBLIC_SUPABASE_URL is correct
- Ensure RLS policies are enabled

### Payments Failing
- Test webhook endpoint: `curl -X POST https://your-domain.com/api/webhooks/xendit`
- Check Xendit dashboard logs
- Verify webhook secret matches

## Rollback

If deployment breaks:

```bash
# View deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

## Production Checklist

- [ ] Supabase project created and schema deployed
- [ ] All environment variables set in Vercel
- [ ] Custom domain configured
- [ ] Auth redirect URLs configured
- [ ] Payment webhooks set up
- [ ] Admin user created
- [ ] Initial builders seeded
- [ ] Test search functionality
- [ ] Test payment flow
- [ ] Test review submission
- [ ] Monitor error logs for 24 hours


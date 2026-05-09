# 🏠 Restate — Nigeria's Premier Real Estate Marketplace

A full-stack real estate marketplace MVP with escrow payments, role-based access control, Cloudinary image uploads, and real-time messaging.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Auth** | Supabase Auth — email/password, role-based (buyer / agent / admin) |
| **Listings** | Full CRUD, Cloudinary image upload, multi-image gallery |
| **Search & Filter** | Location, type, price range, bedrooms, listing type |
| **Favorites** | Buyers save properties with one click |
| **Messaging** | Real-time buyer ↔ agent chat per property |
| **Escrow Payments** | Paystack integration with pending → held → released flow |
| **Admin Panel** | Approve/reject listings, manage users, control escrow |
| **Agent Dashboard** | Listings management, earnings tracker, messages |
| **Buyer Dashboard** | Saved properties, transaction tracker, messages |
| **Animations** | Framer Motion throughout |
| **Responsive** | Mobile-first design |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom design system
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase Auth
- **Images**: Cloudinary
- **Payments**: Paystack (sandbox mode)
- **Icons**: Font Awesome 6
- **Forms**: React Hook Form + Zod
- **Notifications**: React Hot Toast

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/restate.git
cd restate
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run
3. Copy your **Project URL** and **Anon Key** from Settings → API

### 3. Set Up Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) → Create account
2. Go to **Settings → Upload → Upload Presets**
3. Create a new **unsigned** preset named `restate_properties`
4. Copy your **Cloud Name**, **API Key**, and **API Secret**

### 4. Set Up Paystack

1. Go to [paystack.com](https://paystack.com) → Create account
2. Go to **Settings → API Keys & Webhooks**
3. Copy your **Test Public Key** and **Test Secret Key**
4. Set webhook URL to: `https://yourdomain.com/api/webhooks/paystack`

### 5. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Create Admin Account

1. Start the dev server: `npm run dev`
2. Register at `/auth/register` using email `admin@restate.ng`
3. Run this SQL in your Supabase SQL editor:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'admin@restate.ng';
```

### 7. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
restate/
├── app/
│   ├── (public)/              # Public pages
│   ├── api/                   # API routes
│   │   ├── cloudinary/        # Image deletion
│   │   ├── properties/        # Property search API
│   │   └── webhooks/paystack/ # Payment webhook
│   ├── auth/                  # Login & Register
│   ├── dashboard/
│   │   ├── admin/             # Admin dashboard + pages
│   │   ├── agent/             # Agent dashboard + pages
│   │   └── buyer/             # Buyer dashboard + pages
│   ├── listings/              # Property listings page
│   ├── property/[id]/         # Property detail page
│   ├── about/
│   ├── contact/
│   ├── layout.tsx             # Root layout + providers
│   ├── page.tsx               # Home page
│   └── not-found.tsx          # 404 page
├── components/
│   ├── dashboard/             # DashboardSidebar
│   ├── layout/                # Navbar, Footer
│   └── property/              # PropertyCard, SearchFilter, ImageUpload
├── lib/
│   ├── api/                   # properties.ts, transactions.ts
│   ├── supabase/              # client.ts, server.ts
│   ├── auth-context.tsx       # React auth context
│   ├── cloudinary.ts          # Upload utilities
│   └── utils.ts               # Helpers, formatters
├── supabase/
│   └── schema.sql             # Complete DB schema + RLS
├── types/
│   └── index.ts               # TypeScript types
├── middleware.ts              # Route protection
├── tailwind.config.ts
└── .env.local.example
```

---

## 🗄 Database Schema

| Table | Purpose |
|---|---|
| `users` | Extends Supabase auth — name, role, phone, bio |
| `properties` | All listing data — images (JSONB), amenities (array) |
| `transactions` | Escrow flow — pending → held → released |
| `favorites` | User saved properties |
| `messages` | Buyer ↔ Agent chat |
| `inquiries` | Property inquiry records |

All tables have **Row Level Security (RLS)** enabled with fine-grained policies.

---

## 💳 Escrow Payment Flow

```
Buyer clicks "Buy Now"
        ↓
Paystack payment modal opens
        ↓
Payment confirmed (Paystack webhook fires)
        ↓
Transaction status: PENDING
        ↓
Admin reviews → clicks "Hold in Escrow"
        ↓
Transaction status: HELD
        ↓
Property/ownership transferred to buyer
        ↓
Admin clicks "Release to Seller"
        ↓
Transaction status: RELEASED
Property status: SOLD
```

Without real Paystack keys, a **mock reference** is generated automatically so you can test the full flow locally.

---

## 👤 User Roles & Permissions

| Action | Buyer | Agent | Admin |
|---|---|---|---|
| Browse properties | ✅ | ✅ | ✅ |
| Save favorites | ✅ | ❌ | ✅ |
| Contact agents | ✅ | ✅ | ✅ |
| Initiate purchase | ✅ | ❌ | ✅ |
| Create listings | ❌ | ✅ | ✅ |
| Manage own listings | ❌ | ✅ | ✅ |
| Approve listings | ❌ | ❌ | ✅ |
| Manage all users | ❌ | ❌ | ✅ |
| Control escrow | ❌ | ❌ | ✅ |
| Delete any listing | ❌ | ❌ | ✅ |

---

## 🔒 Route Protection

Protected via Next.js Middleware (`middleware.ts`):

| Route | Access |
|---|---|
| `/dashboard/admin/*` | Admin only |
| `/dashboard/agent/*` | Agent + Admin |
| `/dashboard/buyer/*` | Buyer + Admin |
| `/auth/login` | Redirects if logged in |
| `/auth/register` | Redirects if logged in |

---

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Project → Settings → Environment Variables
# Add all variables from .env.local
```

### Paystack Webhook (Production)
Set your webhook URL in Paystack dashboard:
```
https://your-domain.vercel.app/api/webhooks/paystack
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary color | `#C97B2E` (brand-500) |
| Font | Geist Sans + Playfair Display |
| Border radius | `rounded-xl` (12px), `rounded-2xl` (16px) |
| Shadow | `shadow-card`, `shadow-card-hover`, `shadow-modal` |
| Animation | Framer Motion throughout |

---

## 🧪 Testing the App Locally

### Demo Accounts (set up in Supabase)

| Role | Email | Password |
|---|---|---|
| Admin | admin@restate.ng | password123 |
| Agent | agent@restate.ng | password123 |
| Buyer | buyer@restate.ng | password123 |

### Full Test Flow

1. **Register as Agent** → Create a listing → Upload images
2. **Log in as Admin** → Approve the listing → Feature it
3. **Register as Buyer** → Browse listings → Save to favorites
4. **As Buyer** → View property → Click "Buy Now" → Complete mock payment
5. **As Admin** → Go to Transactions → Hold in Escrow → Release to Seller
6. **As Buyer** → Verify transaction shows "Released" ✅

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `@supabase/supabase-js` | Supabase client |
| `@supabase/ssr` | Server-side Supabase helpers |
| `framer-motion` | Animations |
| `next-cloudinary` | Cloudinary Next.js integration |
| `react-hot-toast` | Toast notifications |
| `react-hook-form` | Form state management |
| `zod` | Schema validation |
| `clsx` + `tailwind-merge` | Class name utilities |
| `date-fns` | Date formatting |

---

## 🛣 Roadmap (Post-MVP)

- [ ] Real-time messaging (Supabase Realtime subscriptions)
- [ ] Email notifications (Resend/SendGrid)
- [ ] Property analytics dashboard (views, inquiries, conversion)
- [ ] AI property recommendations
- [ ] Virtual tour integration (360° images)
- [ ] Mortgage calculator
- [ ] Property comparison tool
- [ ] Push notifications (PWA)
- [ ] Multi-currency support

---

## 📄 License

MIT — Free to use and modify.

---

Built with ❤️ for Nigeria's real estate market.

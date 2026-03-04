

# Multisense – Haptic Sensation Design Platform

## Overview
A web app for designing, saving, and sharing custom haptic sensation rules for a 6-motor wearable device. Built with React/TypeScript, Tailwind CSS, and Supabase (Lovable Cloud) for auth and data.

---

## Phase 1: Foundation & Auth

- **Set up Lovable Cloud** with Supabase for database and authentication
- **Create `presets` table** with columns: id, user_id, name, description, config (jsonb), public (boolean), created_at, updated_at
- **Implement authentication**: Email/password + Google sign-in via Supabase Auth
- **Build top navbar** with links: Design, Community, My Presets, and Sign In/User menu
- **Set up routing** for all pages: `/` (rule builder), `/community`, `/my-presets`, `/auth`

## Phase 2: Rule Builder (Main Page)

- **Two-section layout** (Front Motors Rule 1 / Back Motors Rule 2), each containing:
  - Stock ticker input (auto-uppercase)
  - Condition type dropdown (Threshold / Rate of Change / Continuous Mapping)
  - Conditional fields that show/hide based on condition type
  - Haptic response parameters: Pattern, Intensity slider (1-10), Duration (hidden for Continuous), Rhythm
  - "Test Pattern" (placeholder) and "Clear Rule" buttons
- **Human silhouette visualization** with front/back toggle showing 6 motor positions, highlighting active motors per rule
- **Bottom action bar**: Save as Preset, Load Preset, Activate Both Rules (placeholder)
- **Blue/purple tech-forward color scheme** applied globally

## Phase 3: Save Preset Modal

- Modal with name (required), description (required), "Make public" checkbox
- Saves current rule configuration as JSON to Supabase `presets` table
- Success toast + redirect to My Presets on save

## Phase 4: Community Presets Page

- **Search bar** (by name, description, ticker) and **filter dropdown** (All / My Presets / Public Only)
- **Preset card grid** showing: icon/emoji, name, creator, description (truncated), stock ticker badges, Load button, Preview button
- **Preview expanded view** showing full readable config with "Load This Preset" button → navigates to rule builder with data populated

## Phase 5: My Presets Page

- Filtered to current user's presets (public + private)
- Cards with Edit, Delete (with confirmation), and Toggle Public/Private actions
- "Create New Preset" button linking back to rule builder

## Phase 6: Seed Data & Polish

- Seed 3 example presets: "Stock Market Pulse", "Tech Heartbeat", "Rising Alert"
- Loading states, error/success toasts, smooth conditional field transitions
- Form validation on all inputs
- Responsive design (desktop-first, mobile-friendly)
- RLS policies: users can CRUD their own presets, anyone can read public presets


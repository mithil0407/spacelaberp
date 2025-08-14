# Furniture Company ERP System

A modern, Notion-inspired kanban-based management system for furniture companies built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Dual-workflow Kanban**: Customer orders and expense tracking on unified interface
- **Intelligent Data Collection**: Stage-specific prompts with data persistence
- **Connected Operations**: Automatic linking between orders, materials, and vendors
- **Real-time Financial Tracking**: Live revenue/expense calculations with outstanding payments
- **Drag & Drop Interface**: Smooth HTML5 drag and drop with touch support
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Real-time**: Supabase real-time subscriptions

## Database Schema

The system uses the following main tables:

- `customers` - Customer information
- `vendors` - Vendor/supplier information
- `customer_orders` - Order workflow with 6 stages (Quotations → Orders → WIP → Completed → Delivered → Paid)
- `materials` - Materials linked to orders
- `expenses` - Purchase order workflow with 6 stages (PO Sent → Goods Received → Bill Received → Approved → Paid → Archived)
- `expense_items` - Items in each expense
- `transactions` - Payment tracking

## Setup Instructions

### 1. Database Setup (Supabase)

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the database schema:
   ```sql
   -- Copy and paste the contents of database/schema.sql into the Supabase SQL editor
   ```

3. Seed the database with sample data:
   ```sql
   -- Copy and paste the contents of database/seed.sql into the Supabase SQL editor
   ```

4. Get your Supabase credentials:
   - Go to Settings → API
   - Copy the Project URL and anon public key

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the same environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## SQL Queries for Supabase

### Drop Existing Schema (if needed)
```sql
-- Drop existing tables if they exist
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS expense_items CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS customer_orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
```

### Create New Schema
Run the complete schema from `database/schema.sql` which includes:
- Table definitions with proper relationships
- Indexes for performance
- Triggers for auto-updating timestamps
- Row Level Security policies
- Auto-calculation functions

### Seed Data
Run the seed data from `database/seed.sql` to populate with sample:
- Customers (Meraki Interiors, ABC Developers, Urban Spaces)
- Vendors (WoodMart, Merino Dealer, Steel Works)
- Sample orders in different stages
- Sample expenses and materials

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── kanban/            # Kanban board components
│   │   ├── KanbanBoard.tsx
│   │   ├── StageColumn.tsx
│   │   ├── OrderCard.tsx
│   │   └── ExpenseCard.tsx
│   ├── modals/            # Modal components
│   │   ├── StageModal.tsx
│   │   ├── OrderForm.tsx
│   │   └── ExpenseForm.tsx
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── dialog.tsx
│   ├── FinancialMetrics.tsx
│   └── TopNavigation.tsx
├── lib/
│   ├── supabase.ts        # Supabase client & database functions
│   └── utils.ts           # Utility functions
├── store/
│   └── kanban-store.ts    # Zustand state management
└── types/
    ├── index.ts           # Application types
    └── database.ts        # Database types
```

## Key Features Explained

### Order Workflow Stages
1. **Quotations**: Initial quote sent to customer
2. **Orders**: Quote accepted, order confirmed
3. **WIP**: Work in progress, materials planned
4. **Completed**: Production finished
5. **Delivered**: Product delivered to customer
6. **Paid**: Final payment received

### Expense Workflow Stages
1. **PO Sent**: Purchase order sent to vendor
2. **Goods Received**: Materials received
3. **Bill Received**: Invoice received from vendor
4. **Approved**: Bill approved for payment
5. **Paid**: Payment made to vendor
6. **Archived**: Completed and archived

### Financial Metrics
- **Total Revenue**: Advance payments + Final payments received
- **Expenses Paid**: Total amount paid to vendors
- **Outstanding Payments**: Pending payments from customers
- **Bills To Pay**: Pending payments to vendors

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Database Relationships

The system maintains referential integrity with proper foreign keys:
- Orders belong to customers
- Materials belong to orders and vendors
- Expenses belong to vendors and optionally link to orders
- Transactions track all financial movements

## Real-time Features

The application uses Supabase real-time subscriptions to:
- Update kanban boards when data changes
- Sync financial metrics across sessions
- Show live updates when multiple users are working

## Performance Optimizations

- Virtual scrolling for large datasets
- Optimistic updates for better UX
- Debounced auto-save functionality
- Efficient database indexes
- Component-level code splitting

## Security

- Row Level Security (RLS) enabled on all tables
- Proper authentication policies (can be customized)
- Input validation and sanitization
- SQL injection protection via Supabase

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

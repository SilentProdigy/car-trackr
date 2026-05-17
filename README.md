# Car Rental Tracker PWA

A mobile-first Progressive Web Application for managing a car rental business.  
The system helps business owners track cars, customers, bookings, payments, expenses, maintenance records, reports, and team access using Supabase as the backend.

---

## Overview

Car Rental Tracker is designed for small to medium car rental businesses that need a dedicated system instead of using Google Sheets.

The app includes:

- Car fleet management
- Customer records and document uploads
- Booking and reservation tracking
- Car availability validation
- Payment tracking
- Expense tracking
- Maintenance tracking
- Dashboard analytics
- Reports dashboard
- Profile management
- Team/member access control
- Activity logs
- Secure file handling with Supabase Storage
- PWA support for mobile installability

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand-ready architecture
- Lucide React Icons
- Vite PWA Plugin

### Backend

- Supabase Auth
- Supabase PostgreSQL Database
- Supabase Storage
- Supabase Row Level Security
- Supabase RPC Functions
- Supabase Signed URLs for private files

### Hosting

- Vercel for frontend deployment
- Supabase for backend, database, auth, and storage

---

## Main Features

### Authentication

- Register account
- Login
- Logout
- Protected routes
- Owner profile creation
- Business setup flow

---

### Dashboard

The dashboard shows a live business overview:

- Total collected payments
- Pending balances
- Expenses
- Net profit
- Collection rate
- Fleet utilization
- Fleet status
- Booking analytics
- Upcoming returns
- Pending balances
- Top performing cars
- Recent bookings
- Maintenance alerts
- Business totals

---

### Cars Management

Owners and authorized members can manage the vehicle fleet.

Features:

- Add car
- Edit car
- Upload car photo
- View car cards
- Track car status
- Soft delete car
- Prevent deletion of cars with booking history

Car statuses:

- Available
- Reserved
- Rented
- Maintenance
- Inactive

---

### Customers Management

The customer module stores renter information and secure documents.

Features:

- Add customer
- Edit customer
- Search customers
- Upload valid ID
- Upload driver’s license
- View documents using secure signed URLs
- Soft delete customer
- Prevent deletion of customers with booking history

Customer fields include:

- Full name
- Phone
- Email
- Address
- Emergency contact
- Valid ID
- Driver’s license
- Notes

---

### Bookings Management

The bookings module manages rental reservations.

Features:

- Create booking
- Select customer
- Select car
- Auto-calculate rental days
- Auto-calculate total amount
- Auto-calculate balance
- Validate overlapping bookings
- Update booking status
- Update related car status automatically
- Soft delete booking

Booking statuses:

- Pending
- Confirmed
- Ongoing
- Completed
- Cancelled

Payment statuses:

- Unpaid
- Partial
- Paid
- Refunded

Car status behavior:

- Confirmed booking sets car to Reserved
- Ongoing booking sets car to Rented
- Completed booking sets car to Available
- Cancelled booking sets car to Available

---

### Payments Management

The payments module tracks customer payments per booking.

Features:

- Add payment
- Upload receipt
- Auto-update booking paid amount
- Auto-update booking balance
- Auto-update payment status
- Delete payment using soft delete
- Recalculate booking balance after payment deletion
- View receipt using signed URLs

Payment methods:

- Cash
- GCash
- Maya
- Bank Transfer
- Credit Card
- Other

---

### Expenses Management

The expenses module tracks business and vehicle-related costs.

Features:

- Add expense
- Upload receipt
- Assign expense to a car or mark as general business expense
- View expense summary
- Soft delete expense
- View receipt using signed URLs

Expense categories:

- Fuel
- Maintenance
- Repair
- Car Wash
- Insurance
- Registration
- Office Expense
- Marketing
- Other

---

### Maintenance Tracker

The maintenance module tracks vehicle service and repair history.

Features:

- Add maintenance record
- Upload maintenance receipt/file
- Track service date
- Track next service date
- Update maintenance status
- Auto-update car status
- Soft delete maintenance record
- View files using signed URLs

Maintenance statuses:

- Scheduled
- In Progress
- Completed

Car status behavior:

- Scheduled maintenance sets car to Maintenance
- In Progress maintenance sets car to Maintenance
- Completed maintenance sets car to Available

---

### Reports

The reports page provides business intelligence and availability checking.

Reports include:

- Total revenue
- Total collected
- Pending balance
- Expenses
- Maintenance cost
- Net profit
- Booking summary
- Fleet summary
- Top rented cars
- Availability calendar

Availability logic:

A car is unavailable if:

- The selected date overlaps an active booking, and
- The booking status is Pending, Confirmed, or Ongoing

A car is also unavailable if its status is:

- Maintenance
- Inactive

---

### Profile Management

The profile page allows the owner to update:

- Full name
- Business name
- Business phone
- Business email
- Business address
- Business logo

The business logo is stored in Supabase Storage.

---

### Team Management

The system supports role-based team access.

Roles:

| Role | View | Create/Edit | Delete | Team Management | Business Profile |
|---|---:|---:|---:|---:|---:|
| Owner | Yes | Yes | Yes | Yes | Yes |
| Manager | Yes | Yes | Yes | No | Limited |
| Staff | Yes | Yes | No | No | No |
| Viewer | Yes | No | No | No | No |

Current team management uses Supabase Auth user IDs.  
Email invitation can be added later using Supabase Edge Functions.

---

### Activity Logs

The system includes an audit trail for important actions.

Activity logs can track:

- Created records
- Updated records
- Soft-deleted records
- Profile updates
- Booking changes
- Payment changes
- Staff activity

---

## Security Features

The app includes several production-focused security improvements.

### Authentication

- Supabase Auth
- Protected frontend routes
- User session management

### Database Security

- Row Level Security enabled
- Business ownership checks
- Member role checks
- Role-based permissions
- Status constraints
- Amount constraints
- Soft delete support

### Storage Security

Public buckets:

- business-logos
- car-photos

Private buckets:

- customer-documents
- receipts
- maintenance-files

Private files are accessed using signed URLs instead of public links.

### Soft Delete

Important records use `deleted_at` instead of permanent deletion.

Soft-deleted records are hidden from the app but remain in the database for audit and recovery purposes.

Tables with soft delete:

- cars
- customers
- bookings
- payments
- expenses
- maintenance

---

## Project Structure

```txt
src/
├── app/
├── components/
│   ├── layout/
│   │   └── BottomNav.tsx
│   └── ui/
│       ├── AuthCard.tsx
│       ├── ConfirmModal.tsx
│       ├── FormInput.tsx
│       ├── PrimaryButton.tsx
│       ├── SecureFileButton.tsx
│       └── Toast.tsx
├── features/
│   ├── activity/
│   │   ├── activityApi.ts
│   │   └── ActivityLogsPage.tsx
│   ├── auth/
│   │   ├── BusinessSetupPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── useAuth.ts
│   │   └── usePermissions.ts
│   ├── bookings/
│   │   ├── AddBookingForm.tsx
│   │   ├── BookingCard.tsx
│   │   ├── bookingsApi.ts
│   │   ├── BookingsPage.tsx
│   │   └── BookingStatusBadge.tsx
│   ├── cars/
│   │   ├── AddCarForm.tsx
│   │   ├── CarCard.tsx
│   │   ├── carsApi.ts
│   │   ├── CarsPage.tsx
│   │   └── CarStatusBadge.tsx
│   ├── customers/
│   │   ├── AddCustomerForm.tsx
│   │   ├── CustomerCard.tsx
│   │   ├── customersApi.ts
│   │   └── CustomersPage.tsx
│   ├── dashboard/
│   │   ├── dashboardApi.ts
│   │   ├── DashboardMetricCard.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── DashboardSection.tsx
│   │   └── ProgressBar.tsx
│   ├── expenses/
│   │   ├── AddExpenseForm.tsx
│   │   ├── ExpenseCard.tsx
│   │   ├── expensesApi.ts
│   │   └── ExpensesPage.tsx
│   ├── maintenance/
│   │   ├── AddMaintenanceForm.tsx
│   │   ├── MaintenanceCard.tsx
│   │   ├── maintenanceApi.ts
│   │   ├── MaintenancePage.tsx
│   │   └── MaintenanceStatusBadge.tsx
│   ├── payments/
│   │   ├── AddPaymentForm.tsx
│   │   ├── PaymentCard.tsx
│   │   ├── paymentsApi.ts
│   │   └── PaymentsPage.tsx
│   ├── profile/
│   │   ├── profileApi.ts
│   │   └── ProfilePage.tsx
│   ├── reports/
│   │   ├── AvailabilityCalendar.tsx
│   │   ├── ReportSummaryCard.tsx
│   │   ├── reportsApi.ts
│   │   └── ReportsPage.tsx
│   └── team/
│       ├── teamApi.ts
│       └── TeamPage.tsx
├── lib/
│   ├── activityLog.ts
│   ├── business.ts
│   ├── permissions.ts
│   ├── storage.ts
│   └── supabase.ts
├── routes/
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── types/
│   └── database.ts
├── App.tsx
├── index.css
└── main.tsx
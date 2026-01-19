# InventoryPro - Inventory & Order Management System

A comprehensive inventory and order management system with role-based access control, stock tracking, and receipt printing.

## Demo Accounts

| Role | Email | Access Level |
|------|-------|--------------|
| Super Admin | `superadmin@inventory.com` | Full system access |
| Admin | `admin@inventory.com` | Administrative access |
| Manager | `manager@inventory.com` | Operations management |
| Staff | `staff@inventory.com` | Basic operations |

*Any password works in demo mode*

## Features

- **Dashboard** - Real-time stats and charts
- **Inventory** - Product CRUD with stock levels
- **Stock Movements** - Inward, outward, adjustments
- **Orders** - Create orders with auto stock deduction
- **Receipt Printing** - 80mm thermal printer format
- **Email Receipts** - Send to customers
- **User Management** - Create/edit users, assign roles
- **Roles & Permissions** - CRUD + action-based permissions
- **Audit History** - Complete activity trail

## API Endpoints (To Build)

### Authentication
- `POST /auth/signup` - Register user
- `POST /auth/login` - Sign in
- `POST /auth/logout` - Sign out

### Users
- `GET /users` - List users
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Deactivate user

### Roles & Permissions
- `GET /roles` - List roles
- `POST /roles` - Create role
- `GET /permissions` - List permissions
- `POST /role_permissions` - Assign permission to role

### Products
- `GET /products` - List products
- `POST /products` - Create product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Stock Movements
- `GET /stock_movements` - List movements
- `POST /stock_movements` - Record movement (auto-updates stock)

### Orders
- `GET /orders` - List orders
- `POST /orders` - Create order (auto-reduces stock)
- `PATCH /orders/:id` - Update status
- `POST /send-receipt` - Email receipt (Edge Function)

### Audit Logs
- `GET /audit_logs` - List audit history

## Database Tables

- `users` - User accounts with role_id
- `roles` - Role definitions (super_admin, admin, manager, staff, custom)
- `permissions` - Permission definitions (module + action)
- `role_permissions` - Role-permission assignments
- `staff` - Employee details
- `products` - Product catalog
- `stock_movements` - Stock history
- `orders` - Order headers
- `order_items` - Order line items
- `audit_logs` - Activity history
- `company_settings` - Business info for receipts

## Security Notes

- Store roles in separate table (not on user record)
- Use RLS policies for all tables
- Check permissions server-side via `has_permission()` function
- Never expose service role key to frontend
- Use Edge Functions for email sending with RESEND_API_KEY

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Router v6
- Supabase (recommended backend)

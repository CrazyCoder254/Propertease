🏠 SmartRent Hub (Propertease)

SmartRent Hub, also known as Propertease, is a modern, web-based smart property management system designed to simplify and automate rental property operations. It provides a centralized platform for administrators, landlords, and tenants to manage properties, tenants, rent payments, and maintenance requests efficiently.

🚀 Features
🔐 Authentication & User Roles

Secure authentication powered by Lovable Cloud

Role-based access control:

Administrator – Full system access

Landlord – Manage properties, tenants, rent, and maintenance

Tenant – View rent, submit maintenance requests, manage profile

Protected routes and role-aware UI

Login, signup, logout, and profile editing

🏢 Property Management

Create, view, and manage rental properties

Property types (apartment, house, condo, commercial)

Status tracking (vacant, occupied, under maintenance)

Landlord-to-property ownership enforcement

👥 Tenant Management

Add and manage tenants

Assign tenants to properties

Lease period tracking

Rent status indicators (paid, pending, overdue)

💰 Rent Management

Record rent payments

Track payment status per tenant

Monthly rent records

Persistent storage across sessions

🛠 Maintenance Requests

Tenants can submit maintenance requests

Priority levels (low, medium, high)

Status tracking (pending, in-progress, completed)

Landlord and admin oversight

📊 Dashboard & UI

Clean, modern SaaS-inspired interface

Key statistics overview

Role-based sidebar navigation

Fully responsive design

Custom branding with favicon and logo across the app

🧱 Tech Stack
Frontend

React + TypeScript

Vite

Tailwind CSS

Zod for form validation

Component-based, responsive UI

Backend

Lovable Cloud (Supabase-based)

PostgreSQL database

Row Level Security (RLS)

Role-based database policies

Database

Properties

Tenants

Maintenance Requests

Rent Payments

User Profiles & Roles

🔒 Security

Row Level Security (RLS) on all tables

Users can only access data permitted by their role

Secure authentication and session handling

📁 Project Structure (Simplified)
src/
├── components/
├── hooks/
│   ├── useProperties.ts
│   ├── useTenants.ts
│   ├── useMaintenance.ts
│   └── useRentPayments.ts
├── pages/
│   ├── Dashboard
│   ├── Properties
│   ├── Tenants
│   ├── Rent
│   ├── Maintenance
│   └── Settings
├── auth/
├── App.tsx
└── main.tsx

⚙️ Setup & Installation
# Clone the repository
git clone https://github.com/your-username/smartrent-hub.git

# Navigate into the project
cd smartrent-hub

# Install dependencies
npm install

# Run the development server
npm run dev


⚠️ Note: This project requires Lovable Cloud to be enabled for authentication, database access, and persistence.

🧪 Demo Accounts (Optional)

You can create users with different roles during signup:

Admin

Landlord

Tenant

Each role will automatically see different features and navigation options.

🛣️ Future Enhancements

Notifications & alerts system

File uploads for maintenance requests

Advanced reporting & analytics

Online rent payments

Messaging between landlords and tenants

📜 License

This project is for educational and demonstration purposes.
Feel free to fork and extend.

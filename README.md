# Inventory Management System

A modern, departmental inventory management system built with **React** and **TypeScript**. This application allows organizations to efficiently manage, track, and analyze inventory across multiple departments with role-based access, analytics, and a user-friendly interface.

**Live Demo:** https://inventory-management-theta-lilac.vercel.app/

---

## Features

### Department-Based Inventory Management

- Manage inventory items for departments: **IT, HR, Sales, Support, Clerks, and Electric**
- Each department can only access and manage their own inventory unless the user is an admin

### Role-Based Access Control

- **Admin users:** Full access to all departments, users, and settings
- **Regular users:** Department-specific access and permissions (view, add, edit, delete)

### Inventory Operations

- Add, edit, and delete inventory items
- Track item details:
  - Name
  - Description
  - Category
  - Department
  - Quantity
  - Status (available, low, out-of-stock)
  - Location
  - Last updated timestamp
- Filter and search inventory by category, status, or keywords

### User Management (Admin only)

- View the list of users
- Manage user accounts and permissions

### Dashboard Overview

- Quick summary of department inventory status
- Lists low stock and out-of-stock items for each department

### Analytics

- Visual dashboards for item status, category distribution, and department breakdown (for admins)
- Top categories and department-wide inventory statistics

### Settings Page (Admin only)

- Manage global application settings

### Authentication

- Login system for secure access
- Session-based authentication with user role awareness

### UI & Experience

- Responsive design with **Tailwind CSS**
- Sidebar navigation for quick access to all main sections

---

## Technologies Used

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Icons & Charts:** Lucide React
- **State Management:** React Context API

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/wajeeh-shaikh/inventory-management.git
cd inventory-management
npm install
# or
yarn install
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

---

## Project Structure

```
src/
  components/   # Reusable UI components (Sidebar, Table, Modal, etc.)
  context/      # React Contexts for authentication and inventory management
  data/         # Mock data for users and inventory items
  pages/        # Main application pages (Dashboard, Inventory, Analytics, Users, Settings)
  types/        # TypeScript type definitions
```

---

## Departments & Permissions

- **Departments:** IT, HR, Sales, Support, Clerks, Electric
- **Permissions:** view, add, edit, delete
- **Admin:** Full access to all departments, users, analytics, and settings
- **Regular User:** Access limited to their department, as per their permissions

---

> **Note:**  
> This project uses mock data for demonstration purposes.  
> Passwords in mock data are in plain text and for demo only (do not use in production).

---

## License

This project is for demonstration/educational purposes and does not include a license by
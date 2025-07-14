
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import AdminSidebarNew from './AdminSidebarNew';

const AdminLayoutNew = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background flex">
        <AdminSidebarNew />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </AdminRoute>
  );
};

export default AdminLayoutNew;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Dashboard } from "@/components/admin/Dashboard";
import { ProductsPage } from "@/components/admin/ProductsPage";
import { OrdersPage } from "@/components/admin/OrdersPage";
import { CustomersPage } from "@/components/admin/CustomersPage";
import { PCBuilderPage } from "@/components/admin/PCBuilderPage";
import { AnalyticsPage } from "@/components/admin/AnalyticsPage";
import { SettingsPage } from "@/components/admin/SettingsPage";
import { UsersPage } from "@/components/admin/UsersPage";
import { InventoryPage } from "@/components/admin/InventoryPage";
import { SuppliersPage } from "@/components/admin/SuppliersPage";
import { ReportsPage } from "@/components/admin/ReportsPage";
import { FinancePage } from "@/components/admin/FinancePage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <ProductsPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/customers" element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <CustomersPage />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="/pc-builder" element={
                <ProtectedRoute allowedRoles={['admin', 'manager', 'builder']}>
                  <PCBuilderPage />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="/inventory" element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <InventoryPage />
                </ProtectedRoute>
              } />
              <Route path="/suppliers" element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <SuppliersPage />
                </ProtectedRoute>
              } />
              <Route path="/finance" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <FinancePage />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ReportsPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SettingsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

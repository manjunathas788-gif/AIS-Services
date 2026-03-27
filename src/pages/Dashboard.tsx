import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { CustomerDashboard } from '../components/CustomerDashboard';
import { ProcessingDashboard } from '../components/ProcessingDashboard';
import { AdminDashboard } from '../components/AdminDashboard';

interface DashboardProps {
  user: UserProfile;
}

export function Dashboard({ user }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Routes>
        <Route
          path="/"
          element={
            user.role === 'admin' ? (
              <AdminDashboard user={user} />
            ) : user.role === 'processing_unit' ? (
              <ProcessingDashboard user={user} />
            ) : (
              <CustomerDashboard user={user} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

"use client";
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import AddMenuItem from '../components/AddMenuItem';

export default function AdminDashboard() {
  const { userRole, loading, fetchMenu } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && userRole !== 'admin') {
      router.push('/');
    }
  }, [userRole, loading, router]);

  
  if (loading || userRole !== 'admin') return null;

  return (
    <div className="py-8">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h2>
        <p className="text-gray-600 mt-2">Manage your coffee shop menu, add items, and update prices.</p>
      </div>

      <AddMenuItem onAddSuccess={fetchMenu} />

      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Inventory Management</h3>
        <p className="text-gray-500">
          The Edit and Delete features will appear here once the PUT and DELETE routes are added to the NestJS backend.
        </p>
      </div>
    </div>
  );
}
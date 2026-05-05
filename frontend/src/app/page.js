"use client";
import { useContext, useEffect } from 'react';
import { AppContext } from './context/AppContext';

export default function MenuPage() {
  const { menuItems, loading, fetchMenu } = useContext(AppContext);

  useEffect(() => {
    fetchMenu();
    
  }, []);

  return (
    <div className="py-8">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">Our Menu</h2>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading freshly brewed menu...</div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 text-lg">
          No items found in the database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">{item.name}</h3>
              {item.description && <p className="text-gray-600 text-sm mb-5 leading-relaxed">{item.description}</p>}
              <p className="text-emerald-500 font-bold text-xl">${Number(item.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
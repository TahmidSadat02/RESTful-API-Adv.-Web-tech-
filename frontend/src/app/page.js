"use client";
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from './context/AppContext';
import api from './lib/axios';

export default function MenuPage() {
  const { menuItems, loading, fetchMenu, token, userName, triggerNotification } = useContext(AppContext);
  const router = useRouter();
  const [orderingId, setOrderingId] = useState(null);
  
  
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchMenu();
    
  }, []);

  
  const handleQuantityChange = (id, delta) => {
    setQuantities(prev => {
      const currentQty = prev[id] || 1;
      const newQty = currentQty + delta;
      
      return { ...prev, [id]: Math.max(1, newQty) };
    });
  };

  const handleBuyNow = async (item) => {
    if (!token) {
      triggerNotification("Please log in or register to place an order.");
      router.push('/login');
      return;
    }

    setOrderingId(item.id);
    const finalQuantity = quantities[item.id] || 1; 
    
    try {
      await api.post('/orders', {
        items: [
          {
            menuItemId: item.id,
            quantity: finalQuantity 
          }
        ]
      });
      
      triggerNotification(`Order placed for ${finalQuantity}x ${item.name}! Check your email.`);
      
      
      setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    } catch (error) {
      console.error("Order failed:", error);
      triggerNotification(error.response?.data?.message || "Failed to place order.");
    } finally {
      setOrderingId(null);
    }
  };

  return (
    <div className="py-8">
      <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">
          {token && userName ? `Welcome back, ${userName}! ☕` : 'Welcome to Coffee and Code ☕'}
        </h1>
        <p className="text-amber-800 font-medium">Where great coffee meets great code. Enjoy our curated selection of premium brews.</p>
      </div>
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Our Menu</h2>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading freshly brewed menu...</div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 text-lg">
          No items found in the database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const qty = quantities[item.id] || 1; 

            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <span className="text-emerald-600 font-bold text-lg">${Number(item.price).toFixed(2)}</span>
                  </div>
                  {item.description && <p className="text-gray-600 text-sm mb-6 leading-relaxed">{item.description}</p>}
                </div>

                <div className="mt-4">
                  {item.isAvailable && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-3 border border-gray-200">
                      <span className="text-sm font-bold text-gray-700 ml-2">Qty:</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 rounded bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="font-bold w-4 text-center text-gray-900">{qty}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 rounded bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => handleBuyNow(item)}
                    disabled={orderingId === item.id || !item.isAvailable}
                    className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {orderingId === item.id 
                      ? 'Placing Order...' 
                      : !item.isAvailable 
                        ? 'Out of Stock' 
                        : `Buy Now • $${(Number(item.price) * qty).toFixed(2)}`}
                  </button>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
"use client";
import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';

export default function AddMenuItem({ onAddSuccess }) {

  const { token, triggerNotification } = useContext(AppContext);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/menu', {
        name,
        description,
        price: parseFloat(price), // Backend expects a number
        isAvailable: true
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      setName('');
      setDescription('');
      setPrice('');
      triggerNotification(`${name} was added to the menu!`);
      if (onAddSuccess) onAddSuccess();
      
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        setError(errorMessage.join(', '));
      } else {
        setError(errorMessage || err.message || 'Failed to add item');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition-all";

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Menu Item</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-bold border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Item Name (e.g., Choco Coffee)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Description (e.g., Joss)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        
        <div className="w-full md:w-1/6">
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="w-full md:w-1/6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add to Menu'}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";
import { useState, useContext } from 'react';
import api from '../lib/axios';
import { AppContext } from '../context/AppContext';

export default function AddMenuItem({ onAddSuccess }) {
  const { triggerNotification } = useContext(AppContext);

  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Item Name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    const priceNum = parseFloat(formData.price);
    if (!formData.price.trim() || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Price must be greater than 0.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (validateForm()) {
      try {
        const response = await api.post('/menu', {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price)
        });

        if (response.status === 201) {
          setFormData({ name: '', description: '', price: '' });
          triggerNotification("Item added successfully!");
          if (onAddSuccess) onAddSuccess();
        }
      } catch (err) {
        setServerError(err.response?.data?.message || 'Server error. Are you logged in as an Admin?');
      }
    }
  };

  const inputBaseClass = "w-full p-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all";

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200 mb-10 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Menu Item</h3>
      
      {serverError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-medium border border-red-100">
          {serverError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1 w-full">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            className={`${inputBaseClass} ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-2 font-medium">{errors.name}</p>}
        </div>

        <div className="flex-1 w-full">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className={`${inputBaseClass} ${errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-2 font-medium">{errors.description}</p>}
        </div>

        <div className="w-full md:w-32">
          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className={`${inputBaseClass} ${errors.price ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
          />
          {errors.price && <p className="text-red-500 text-xs mt-2 font-medium">{errors.price}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full md:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Add to Menu
        </button>
      </form>
    </div>
  );
}
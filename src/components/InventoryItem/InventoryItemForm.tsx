import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import { InventoryItem, Department } from '../../types';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Select from '../UI/Select';

interface InventoryItemFormProps {
  item?: InventoryItem;
  onSubmit: () => void;
  onCancel: () => void;
}

const departmentOptions = [
  { value: 'IT', label: 'IT' },
  { value: 'HR', label: 'HR' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Support', label: 'Support' },
  { value: 'Clerks', label: 'Clerks' },
  { value: 'Electric', label: 'Electric' },
];

const categoryOptions = [
  { value: 'Hardware', label: 'Hardware' },
  { value: 'Software', label: 'Software' },
  { value: 'Office Supplies', label: 'Office Supplies' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Tools', label: 'Tools' },
  { value: 'Supplies', label: 'Supplies' },
  { value: 'Documents', label: 'Documents' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Other', label: 'Other' },
];

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({
  item,
  onSubmit,
  onCancel,
}) => {
  const { addItem, updateItem } = useInventory();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState<Partial<InventoryItem>>(
    item || {
      name: '',
      description: '',
      department: currentUser?.isAdmin ? 'IT' : currentUser?.department || 'IT',
      quantity: 0,
      category: '',
      location: '',
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.quantity === undefined || formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (item) {
      updateItem(item.id, formData);
    } else {
      addItem({
        ...formData as Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>,
        addedBy: currentUser?.id || '',
      });
    }
    
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        fullWidth
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Department"
          name="department"
          value={formData.department}
          onChange={(value) => handleSelectChange('department', value)}
          options={departmentOptions}
          error={errors.department}
          disabled={!currentUser?.isAdmin}
          fullWidth
        />
        
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={(value) => handleSelectChange('category', value)}
          options={categoryOptions}
          error={errors.category}
          fullWidth
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          min="0"
          value={formData.quantity?.toString()}
          onChange={handleNumberChange}
          error={errors.quantity}
          fullWidth
          required
        />
        
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          error={errors.location}
          fullWidth
          required
        />
      </div>
      
      <div className="w-full">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className={`px-3 py-2 bg-white border ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full`}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {item ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryItemForm;
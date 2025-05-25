import React, { useState } from 'react';
import { User, Department, Permission } from '../../types';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Select from '../UI/Select';

interface UserFormProps {
  user?: User;
  onSubmit: (userData: Partial<User>) => void;
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

const permissionOptions = [
  { value: 'view', label: 'View' },
  { value: 'edit', label: 'Edit' },
  { value: 'add', label: 'Add' },
  { value: 'delete', label: 'Delete' },
];

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      username: '',
      password: '',
      name: '',
      email: '',
      department: 'IT',
      isAdmin: false,
      permissions: ['view'],
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username?.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!user && !formData.password?.trim()) {
      newErrors.password = 'Password is required';
    }
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.permissions || formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission is required';
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
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value as Department }));
  };
  
  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const permission = value as Permission;
    
    setFormData((prev) => {
      const currentPermissions = prev.permissions || [];
      
      if (checked) {
        return {
          ...prev,
          permissions: [...currentPermissions, permission],
        };
      } else {
        return {
          ...prev,
          permissions: currentPermissions.filter((p) => p !== permission),
        };
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          fullWidth
          required
        />
        
        <Input
          label={user ? 'New Password (leave blank to keep current)' : 'Password'}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          fullWidth
          required={!user}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          fullWidth
          required
        />
        
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          fullWidth
          required
        />
      </div>
      
      <Select
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleDepartmentChange}
        options={departmentOptions}
        error={errors.department}
        fullWidth
      />
      
      <div className="mt-4">
        <div className="flex items-center">
          <input
            id="isAdmin"
            name="isAdmin"
            type="checkbox"
            checked={formData.isAdmin}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
            Administrator
          </label>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Administrators have full access to all departments and system settings.
        </p>
      </div>
      
      <div className="mt-4">
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Permissions
        </span>
        <div className="space-y-2">
          {permissionOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={`permission-${option.value}`}
                name="permissions"
                type="checkbox"
                value={option.value}
                checked={formData.permissions?.includes(option.value as Permission)}
                onChange={handlePermissionChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`permission-${option.value}`}
                className="ml-2 block text-sm text-gray-900"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {errors.permissions && (
          <p className="mt-1 text-sm text-red-600">{errors.permissions}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
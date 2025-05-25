import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    companyName: 'Company Name',
    systemName: 'Inventory Management System',
    defaultDepartment: 'IT',
    notificationEmail: 'admin@company.com',
    lowStockThreshold: '5',
    dataRetentionDays: '90',
    theme: 'light',
  });
  
  const [savedSettings, setSavedSettings] = useState({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleReset = () => {
    setSettings({ ...savedSettings });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setSavedSettings({ ...settings });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System Default' },
  ];
  
  const departmentOptions = [
    { value: 'IT', label: 'IT' },
    { value: 'HR', label: 'HR' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Support', label: 'Support' },
    { value: 'Clerks', label: 'Clerks' },
    { value: 'Electric', label: 'Electric' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage system-wide settings and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card title="General Settings">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleChange}
                  fullWidth
                />
                
                <Input
                  label="System Name"
                  name="systemName"
                  value={settings.systemName}
                  onChange={handleChange}
                  fullWidth
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Default Department"
                  name="defaultDepartment"
                  value={settings.defaultDepartment}
                  onChange={(value) => handleSelectChange('defaultDepartment', value)}
                  options={departmentOptions}
                  fullWidth
                />
                
                <Input
                  label="Notification Email"
                  name="notificationEmail"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={handleChange}
                  fullWidth
                />
              </div>
            </div>
          </Card>

          <Card title="Inventory Settings">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Low Stock Threshold"
                  name="lowStockThreshold"
                  type="number"
                  min="1"
                  value={settings.lowStockThreshold}
                  onChange={handleChange}
                  fullWidth
                />
                
                <Input
                  label="Data Retention (days)"
                  name="dataRetentionDays"
                  type="number"
                  min="1"
                  value={settings.dataRetentionDays}
                  onChange={handleChange}
                  fullWidth
                />
              </div>
            </div>
          </Card>

          <Card title="Appearance">
            <div className="space-y-4">
              <Select
                label="Theme"
                name="theme"
                value={settings.theme}
                onChange={(value) => handleSelectChange('theme', value)}
                options={themeOptions}
                fullWidth
              />
            </div>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              className="flex items-center"
              disabled={isSaving}
            >
              <RefreshCw size={16} className="mr-2" />
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
          
          {saveSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div>
                  <p className="text-sm text-green-700">
                    Settings saved successfully.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
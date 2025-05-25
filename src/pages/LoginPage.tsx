import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = login(username, password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full">
            <Boxes className="h-10 w-10 text-blue-700" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Inventory Management System
          </h1>
          <p className="mt-2 text-gray-600 text-center">
            Sign in to access your department's inventory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <Input
            label="Username"
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" fullWidth>
              Sign in
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-600">
            <span className="block font-medium text-blue-600 mb-1">Demo Accounts:</span>
            admin / admin123 (Administrator) <br />
            ituser / password (IT Department) <br />
            hruser / password (HR Department)
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate">
          Welcome, {currentUser?.name}
        </h2>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <span>{currentUser?.isAdmin ? 'Administrator' : `${currentUser?.department} Department`}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
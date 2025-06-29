import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Boxes, Users, Settings, LogOut, PieChart, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
        active
          ? 'bg-blue-700 text-white'
          : 'text-gray-300 hover:bg-blue-800 hover:text-white'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.isAdmin;

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/inventory', label: 'Inventory', icon: <Boxes size={20} /> },
    ...(isAdmin ? [{ to: '/users', label: 'Users', icon: <Users size={20} /> }] : []),
    { to: '/analytics', label: 'Analytics', icon: <PieChart size={20} /> },
    ...(isAdmin ? [{ to: '/settings', label: 'Settings', icon: <Settings size={20} /> }] : []),
  ];

  return (
    <aside className="w-64 bg-blue-900 h-screen flex flex-col">
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-white flex items-center">
          <Boxes className="mr-2" size={24} />
          Inventory System
        </h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navLinks.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            active={location.pathname === link.to}
          />
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-blue-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium">
              {currentUser?.name.charAt(0)}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{currentUser?.name}</p>
            <p className="text-xs text-blue-300">{currentUser?.department}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-4 flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-blue-800 hover:text-white w-full"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
        <p className="text-blue-300 mt-4 ">Developed by  
        <Link to="https://www.linkedin.com/in/webdeveloper-wajeehshaikh"  className='hover:underline ms-1' target="_blank" rel="noopener noreferrer">
          WS
        </Link>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
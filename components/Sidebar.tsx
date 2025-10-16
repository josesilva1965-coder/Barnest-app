import React from 'react';
import { View, StaffMember } from '../types';
import { PosIcon, InventoryIcon, TablesIcon, ReportsIcon, StaffIcon, FeedbackIcon, KdsIcon, CalendarIcon, LogoutIcon, SettingsIcon, DownloadIcon } from './icons/Icons';
import { ROLE_PERMISSIONS } from '../constants';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  currentUser: StaffMember | null;
  onLogout: () => void;
  showInstallButton: boolean;
  onInstallClick: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex flex-col md:flex-row items-center justify-center md:justify-start p-3 my-1 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-brand-secondary text-white' : 'text-gray-300 hover:bg-brand-primary hover:text-white'
    }`}
    aria-label={`Navigate to ${label} view`}
    role="menuitem"
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className="mt-1 md:mt-0 md:ml-3 text-sm md:text-base font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, currentUser, onLogout, showInstallButton, onInstallClick }) => {
  const allNavItems = [
    { view: View.POS, label: 'POS', icon: <PosIcon className="w-6 h-6" /> },
    { view: View.KDS, label: 'KDS', icon: <KdsIcon className="w-6 h-6" /> },
    { view: View.Inventory, label: 'Inventory', icon: <InventoryIcon className="w-6 h-6" /> },
    { view: View.Tables, label: 'Tables', icon: <TablesIcon className="w-6 h-6" /> },
    { view: View.Reservations, label: 'Reservations', icon: <CalendarIcon className="w-6 h-6" /> },
    { view: View.Reports, label: 'Reports', icon: <ReportsIcon className="w-6 h-6" /> },
    { view: View.Staff, label: 'Staff', icon: <StaffIcon className="w-6 h-6" /> },
    { view: View.Feedback, label: 'Feedback', icon: <FeedbackIcon className="w-6 h-6" /> },
    { view: View.Settings, label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
  ];

  const permittedViews = currentUser ? ROLE_PERMISSIONS[currentUser.role] : [];
  const navItems = allNavItems.filter(item => permittedViews.includes(item.view));

  return (
    <aside className="w-20 md:w-56 bg-brand-dark p-2 md:p-4 flex flex-col">
      <div className="text-white text-2xl font-bold mb-8 text-center">
        <span className="md:hidden">BN</span>
        <span className="hidden md:inline">BarNest</span>
      </div>
      <nav className="flex-1" role="menu" aria-label="Main Navigation">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            label={item.label}
            icon={item.icon}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
          />
        ))}
      </nav>
      
      <div className="mt-auto">
        {showInstallButton && (
          <button
            onClick={onInstallClick}
            className="w-full flex flex-col md:flex-row items-center justify-center md:justify-start p-3 my-1 rounded-lg transition-colors duration-200 text-green-400 hover:bg-green-500/20 hover:text-green-300"
            aria-label="Install BarNest App"
          >
            <DownloadIcon className="w-6 h-6" />
            <span className="mt-1 md:mt-0 md:ml-3 text-sm md:text-base font-medium">Install App</span>
          </button>
        )}
        {currentUser && (
          <div className="text-center mb-4 p-2 rounded-lg bg-brand-primary/50 hidden md:block">
            <p className="font-bold text-white text-sm">{currentUser.name}</p>
            <p className="text-gray-400 text-xs">{currentUser.role}</p>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex flex-col md:flex-row items-center justify-center md:justify-start p-3 my-1 rounded-lg transition-colors duration-200 text-red-400 hover:bg-red-500/20 hover:text-red-300"
          aria-label="Logout"
        >
          <LogoutIcon className="w-6 h-6" />
          <span className="mt-1 md:mt-0 md:ml-3 text-sm md:text-base font-medium">Logout</span>
        </button>
        <div className="text-center text-gray-500 text-xs pt-4 border-t border-brand-primary/20 mt-2">
            <p>Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Settings, FileText, Users, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <aside className="w-72 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 h-screen sticky top-0 flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-sky-900/40">C</div>
          <span className="font-bold text-xl tracking-tight">Capacity</span>
        </div>
        
        <nav className="space-y-2">
          <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem to="/forecasting" icon={<TrendingUp size={20} />} label="Forecasting" />
          <SidebarItem to="/reports" icon={<FileText size={20} />} label="Reports" />
          <SidebarItem to="/users" icon={<Users size={20} />} label="Users" />
          <SidebarItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-700/50">
        <button 
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

const SidebarItem = ({ to, icon, label }: any) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      flex items-center gap-4 px-4 py-3 rounded-xl transition font-medium
      ${isActive ? 'bg-sky-600/10 text-sky-400 shadow-inner' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}
    `}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;

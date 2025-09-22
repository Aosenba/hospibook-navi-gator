
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Home,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Hospitals',
      href: '/admin/hospitals',
      icon: Building2,
    },
    {
      name: 'Appointments',
      href: '/admin/appointments',
      icon: Calendar,
    },
    {
      name: 'Reception Console',
      href: '/admin/reception',
      icon: UserCheck,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <aside className={cn(
        "bg-white z-40 w-64 fixed h-screen border-r transition-all duration-300 ease-in-out lg:left-0",
        sidebarOpen ? "left-0" : "-left-64",
        "lg:block"
      )}>
        <div className="flex flex-col h-full">
          <div className="h-16 border-b flex items-center p-4 justify-between lg:justify-center">
            <h2 className="text-xl font-bold text-medical-blue">Hospital Admin</h2>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-grow p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                  location.pathname === item.href
                    ? "text-medical-blue bg-medical-blue-light font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-medical-blue text-white flex items-center justify-center">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@hospital.com</p>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <Link
                to="/hospibook-navi-gator"
                className="flex items-center px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Home className="h-4 w-4 mr-3" />
                Patient Portal
              </Link>
              <button
                className="w-full flex items-center px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white h-16 px-4 sm:px-6 border-b sticky top-0 z-30 flex items-center">
          <Button variant="ghost" size="sm" className="lg:hidden mr-2" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center justify-between w-full">
            <h1 className="text-lg font-medium lg:hidden">Hospital Admin</h1>
            
            <div className="flex items-center space-x-2">
              <Link to="/hospibook-navi-gator" className="text-sm text-medical-blue hover:underline hidden sm:block">
                <Home className="h-4 w-4 inline-block mr-1" />
                Patient Portal
              </Link>
            </div>
          </div>
        </header>
        
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

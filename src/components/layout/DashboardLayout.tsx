import React, { useState } from 'react';
import { Menu, ChevronDown, User } from 'lucide-react';
import { DASHBOARD_NAV } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<string[]>(['Products']);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 m:hidden"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        !isSidebarOpen && "-translate-x-full md:hidden"
      )}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <span className="text-xl font-bold tracking-tight text-blue-600">jarabiz-admin</span>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {DASHBOARD_NAV.map((item) => {
              const location = useLocation(); // Hook to see which page we are on

              return (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => { setSidebarOpen(false); toggleMenu(item.name); }}
                        className="w-full flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={20} className="text-gray-400 group-hover:text-blue-500" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <ChevronDown size={16} className={cn("transition-transform", openMenus.includes(item.name) && "rotate-180")} />
                      </button>

                      {openMenus.includes(item.name) && (
                        <div className="mt-1 ml-4 pl-4 border-l border-gray-100 space-y-1">
                          {item.children.map((sub) => {
                            const isActive = location.pathname === sub.href;
                            return (
                              <Link
                                key={sub.name}
                                to={sub.href} // Use 'to' instead of 'href'
                                className={cn(
                                  "block p-2 text-sm rounded-md transition-colors",
                                  isActive
                                    ? "text-blue-600 bg-blue-50 font-semibold" // High-end active state
                                    : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
                                )}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg group transition-colors",
                        location.pathname === item.href ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <item.icon size={20} className={cn(location.pathname === item.href ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500")} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-md">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
              <User size={18} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
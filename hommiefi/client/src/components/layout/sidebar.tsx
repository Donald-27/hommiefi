import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Recycle,
  Briefcase,
  Users,
  Heart,
  MessageCircle,
  MessageSquareDashed,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/loop", label: "Loop", icon: Recycle },
  { href: "/gigs", label: "Gigs", icon: Briefcase },
  { href: "/vibe", label: "Vibe", icon: Users },
  { href: "/haven", label: "Haven", icon: Heart },
  { href: "/thread", label: "Thread", icon: MessageSquareDashed },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
        {/* Logo Section */}
        <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-coral to-teal rounded-xl flex items-center justify-center">
              <Home className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 font-poppins">Hommiefi</h1>
              <p className="text-xs text-gray-500" data-testid="text-neighborhood">
                {user?.neighborhood || "Select neighborhood"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-coral/10 text-coral border-l-4 border-coral"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                  {item.label === "Chat" && (
                    <span className="ml-auto bg-coral text-white text-xs px-2 py-1 rounded-full">
                      3
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Emergency Help Section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Need Help Now?</h3>
            <button 
              className="w-full bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm"
              data-testid="button-helpout"
            >
              <AlertTriangle className="inline mr-2 h-4 w-4" />
              HelpOut
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate" data-testid="text-user-name">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">⭐ Verified Neighbor</p>
            </div>
          </div>
          <div className="space-y-1">
            <Link href="/profile">
              <a className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center" data-testid="nav-profile">
                <i className="fas fa-user mr-2"></i>Profile
              </a>
            </Link>
            <Link href="/settings">
              <a className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center" data-testid="nav-settings">
                <i className="fas fa-cog mr-2"></i>Settings
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

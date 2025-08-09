import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Menu } from "lucide-react";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="lg:ml-64 fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-white/20 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="lg:hidden" data-testid="button-menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-semibold text-gray-800" data-testid="text-greeting">
              Good morning, {user?.firstName || 'Neighbor'}! 👋
            </h2>
            <p className="text-sm text-gray-600" data-testid="text-location">
              {user?.neighborhood || "Downtown Brooklyn"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative" data-testid="button-notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-xs rounded-full flex items-center justify-center">
              5
            </span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <Button variant="ghost" size="sm" className="hidden md:block" data-testid="button-user-menu">
              <span className="text-sm font-medium text-gray-700">
                {user?.firstName ? `${user.firstName} ${(user.lastName?.[0] || '').toUpperCase()}.` : 'User'}
              </span>
              <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

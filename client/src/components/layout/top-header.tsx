import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function TopHeader() {
  const { user } = useAuth();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'morning' : currentHour < 18 ? 'afternoon' : 'evening';

  return (
    <div className="lg:ml-64 fixed top-0 left-0 right-0 floating-nav border-b border-white/20 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="lg:hidden">
            <i className="fas fa-bars"></i>
          </Button>
          <div>
            <h2 className="font-semibold text-gray-800">
              Good {greeting}, {user?.firstName}! 👋
            </h2>
            <p className="text-sm text-gray-600">
              {user?.neighborhood?.name || "Your neighborhood"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <i className="fas fa-bell text-lg"></i>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-xs rounded-full flex items-center justify-center">
              5
            </span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover" 
                />
              ) : (
                <i className="fas fa-user text-gray-600"></i>
              )}
            </div>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900">
                {user?.firstName} {user?.lastName?.charAt(0)}.
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

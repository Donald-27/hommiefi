import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Recycle,
  Briefcase,
  Users,
  MessageCircle,
} from "lucide-react";

const mobileNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/loop", label: "Loop", icon: Recycle },
  { href: "/gigs", label: "Gigs", icon: Briefcase },
  { href: "/vibe", label: "Vibe", icon: Users },
  { href: "/chat", label: "Chat", icon: MessageCircle, badge: 3 },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-white/20 z-40">
      <div className="flex justify-around py-2">
        {mobileNavItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex flex-col items-center py-2 px-3 transition-colors",
                  isActive ? "text-coral" : "text-gray-500 hover:text-gray-700"
                )}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                <div className="relative">
                  <Icon className="h-6 w-6 mb-1" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

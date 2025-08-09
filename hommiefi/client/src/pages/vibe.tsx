import { VibeInterface } from "@/components/features/vibe-interface";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";

export default function Vibe() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-background to-teal/5">
      <Sidebar />
      <MobileNav />
      
      <div className="lg:pl-64">
        <Header />
        
        <main className="pt-20 pb-20 lg:pb-8">
          <VibeInterface onBack={() => window.history.back()} />
        </main>
      </div>
    </div>
  );
}

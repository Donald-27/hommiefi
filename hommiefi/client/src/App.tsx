import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";

// Pages
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Loop from "@/pages/loop";
import Gigs from "@/pages/gigs";
import Vibe from "@/pages/vibe";
import Haven from "@/pages/haven";
import Thread from "@/pages/thread";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import AdvancedSettings from "@/pages/advanced-settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
});

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory via-background to-teal/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-coral to-teal rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="fas fa-home text-white text-2xl"></i>
          </div>
          <p className="text-gray-600">Loading Hommiefi...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/loop" component={Loop} />
          <Route path="/gigs" component={Gigs} />
          <Route path="/vibe" component={Vibe} />
          <Route path="/haven" component={Haven} />
          <Route path="/thread" component={Thread} />
          <Route path="/chat" component={Chat} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route path="/settings/advanced" component={AdvancedSettings} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral/20 via-ivory to-teal/20">
      <div className="min-h-screen flex flex-col justify-center items-center p-6">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-coral to-teal rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <i className="fas fa-home text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 font-poppins">
            Welcome to Hommiefi
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Real help. Right next door. Connect with your neighbors.
          </p>
        </div>
        
        <Card className="w-full max-w-sm morphic-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button 
                onClick={handleLogin}
                className="w-full bg-coral text-white py-4 rounded-2xl font-semibold text-lg hover:bg-coral/90 transition-all shadow-lg"
                data-testid="button-login"
              >
                Get Started
              </Button>
              <p className="text-center text-gray-600 text-sm">
                Join your neighborhood community today
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up">
          <Card className="morphic-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-recycle text-coral text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Loop</h3>
              <p className="text-gray-600 text-sm">Share tools, books, and household items with neighbors</p>
            </CardContent>
          </Card>

          <Card className="morphic-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-briefcase text-teal text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Gigs</h3>
              <p className="text-gray-600 text-sm">Quick jobs and errands from neighbors</p>
            </CardContent>
          </Card>

          <Card className="morphic-card text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Vibe</h3>
              <p className="text-gray-600 text-sm">Meet neighbors and make friends instantly</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

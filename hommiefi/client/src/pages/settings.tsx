import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import SmartSettingsWidget from "@/components/features/smart-settings-widget";
import { 
  ArrowLeft, 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  MapPin,
  Palette,
  Flag,
  Ban,
  Save
} from "lucide-react";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: userSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: () => fetch("/api/settings", { credentials: 'include' }).then(res => res.json()),
  });

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: (settingsData: any) => apiRequest("PUT", "/api/settings", settingsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [settings, setSettings] = useState({
    // Profile settings
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    
    // Notification settings
    pushNotifications: true,
    emailNotifications: true,
    newMessages: true,
    emergencyAlerts: true,
    communityUpdates: false,
    
    // Privacy settings
    profileVisibility: "verified_neighbors",
    locationSharing: true,
    onlineStatus: true,
    showEmail: false,
    showPhone: false,
    
    // Location settings
    neighborhood: "",
    city: "",
    state: "",
    
    // Preferences
    theme: "light",
    language: "english",
  });

  // Initialize settings from API data
  useEffect(() => {
    if (userSettings) {
      setSettings(prev => ({ ...prev, ...userSettings }));
    }
  }, [userSettings]);

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "location", label: "Location", icon: MapPin },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  const handleSaveSettings = () => {
    const settingsData = {
      ...settings,
      pushNotifications: settings.pushNotifications,
      emailNotifications: settings.emailNotifications,
      profileVisibility: settings.profileVisibility,
      locationSharing: settings.locationSharing,
      onlineStatus: settings.onlineStatus,
    };
    
    saveSettingsMutation.mutate(settingsData);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Profile Information</h3>
        
        {/* Profile Photo */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-coral to-teal rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {(user as any)?.firstName?.[0] || 'U'}
          </div>
          <div>
            <Button className="bg-coral text-white hover:bg-coral/90">
              Change Photo
            </Button>
            <p className="text-gray-600 text-sm mt-2">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={settings.firstName}
              onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
              placeholder={(user as any)?.firstName || "First name"}
              data-testid="input-settings-first-name"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={settings.lastName}
              onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
              placeholder={(user as any)?.lastName || "Last name"}
              data-testid="input-settings-last-name"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder={(user as any)?.email || "your@email.com"}
              data-testid="input-settings-email"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="(555) 123-4567"
              data-testid="input-settings-phone"
            />
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center space-x-2">
          <Shield className="text-green-600 h-5 w-5" />
          <span className="font-medium text-green-800">Verified Neighbor</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Your identity has been verified. This helps build trust in the community.
        </p>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Notification Preferences</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">Push Notifications</h4>
            <p className="text-gray-600 text-sm">Receive notifications on your device</p>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
            data-testid="switch-push-notifications"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">Email Notifications</h4>
            <p className="text-gray-600 text-sm">Weekly summary and important updates</p>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            data-testid="switch-email-notifications"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">New Messages</h4>
            <p className="text-gray-600 text-sm">Get notified of new chat messages</p>
          </div>
          <Switch
            checked={settings.newMessages}
            onCheckedChange={(checked) => setSettings({ ...settings, newMessages: checked })}
            data-testid="switch-new-messages"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">Emergency Alerts</h4>
            <p className="text-gray-600 text-sm">HelpOut requests in your area</p>
          </div>
          <Switch
            checked={settings.emergencyAlerts}
            onCheckedChange={(checked) => setSettings({ ...settings, emergencyAlerts: checked })}
            data-testid="switch-emergency-alerts"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">Community Updates</h4>
            <p className="text-gray-600 text-sm">News and updates from your neighborhood</p>
          </div>
          <Switch
            checked={settings.communityUpdates}
            onCheckedChange={(checked) => setSettings({ ...settings, communityUpdates: checked })}
            data-testid="switch-community-updates"
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Privacy & Safety</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">Profile Visibility</h4>
            <p className="text-gray-600 text-sm">Who can see your full profile</p>
          </div>
          <Select value={settings.profileVisibility} onValueChange={(value) => setSettings({ ...settings, profileVisibility: value })}>
            <SelectTrigger className="w-48" data-testid="select-profile-visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verified_neighbors">Verified neighbors only</SelectItem>
              <SelectItem value="all_neighbors">All neighbors</SelectItem>
              <SelectItem value="friends_only">Friends only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">Location Sharing</h4>
            <p className="text-gray-600 text-sm">Show approximate distance to other users</p>
          </div>
          <Switch
            checked={settings.locationSharing}
            onCheckedChange={(checked) => setSettings({ ...settings, locationSharing: checked })}
            data-testid="switch-location-sharing"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">Online Status</h4>
            <p className="text-gray-600 text-sm">Let others see when you're active</p>
          </div>
          <Switch
            checked={settings.onlineStatus}
            onCheckedChange={(checked) => setSettings({ ...settings, onlineStatus: checked })}
            data-testid="switch-online-status"
          />
        </div>
      </div>

      {/* Safety Tools */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">Safety Tools</h4>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
            <Flag className="mr-2 h-4 w-4" />
            Report User
          </Button>
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
            <Ban className="mr-2 h-4 w-4" />
            Blocked Users
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLocationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">Location Settings</h3>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-gray-800">Current Neighborhood</h4>
          <p className="text-gray-600">{(user as any)?.neighborhood || "Neighborhood not set"}</p>
          <p className="text-sm text-gray-500">Active neighbors in area</p>
        </div>
        <Button className="text-coral hover:text-coral/80 font-medium">
          Change
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={settings.city}
            onChange={(e) => setSettings({ ...settings, city: e.target.value })}
            placeholder={(user as any)?.city || "City"}
            data-testid="input-settings-city"
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={settings.state}
            onChange={(e) => setSettings({ ...settings, state: e.target.value })}
            placeholder={(user as any)?.state || "State"}
            data-testid="input-settings-state"
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value="United States"
            disabled
            className="bg-gray-50"
            data-testid="input-settings-country"
          />
        </div>
      </div>
    </div>
  );

  const renderPreferencesSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">App Preferences</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">Theme</h4>
            <p className="text-gray-600 text-sm">Choose your preferred app theme</p>
          </div>
          <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
            <SelectTrigger className="w-32" data-testid="select-theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">Language</h4>
            <p className="text-gray-600 text-sm">Select your preferred language</p>
          </div>
          <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
            <SelectTrigger className="w-32" data-testid="select-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Logout Section */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">Account Actions</h4>
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="border-red-200 text-red-700 hover:bg-red-50"
          data-testid="button-logout"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Sign Out
        </Button>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return renderPrivacySettings();
      case "location":
        return renderLocationSettings();
      case "preferences":
        return renderPreferencesSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-background to-teal/5">
      <Sidebar />
      <MobileNav />
      
      <div className="lg:pl-64">
        <Header />
        
        <main className="pt-20 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild className="lg:hidden">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h2 className="text-2xl font-bold text-gray-800 font-poppins">
                <SettingsIcon className="inline mr-3 text-gray-600" />
                Settings & Preferences
              </h2>
            </div>
          </div>

          {/* Smart Settings Widget */}
          <div className="max-w-6xl mx-auto mb-8">
            <SmartSettingsWidget 
              onApplyRecommendation={(recommendation) => {
                console.log("Applying recommendation:", recommendation);
                toast({
                  title: "Recommendation Applied",
                  description: `${recommendation.action} has been enabled`,
                });
              }}
            />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Settings Navigation */}
              <div className="lg:col-span-1">
                <Card className="morphic-card p-4 sticky top-24">
                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                            activeSection === section.id
                              ? "bg-coral/10 text-coral border-l-4 border-coral"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          data-testid={`settings-nav-${section.id}`}
                        >
                          <Icon className="inline mr-2 h-4 w-4" />
                          {section.label}
                        </button>
                      );
                    })}
                    
                    {/* Advanced Settings Link */}
                    <div className="pt-4 border-t border-gray-200">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/settings/advanced">
                          <Shield className="mr-2 h-4 w-4" />
                          Advanced Settings
                        </Link>
                      </Button>
                    </div>
                  </nav>
                </Card>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                <Card className="morphic-card p-6">
                  {renderSectionContent()}
                  
                  {/* Save Button */}
                  <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                    <Button 
                      onClick={handleSaveSettings}
                      className="bg-coral text-white hover:bg-coral/90"
                      data-testid="button-save-settings"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

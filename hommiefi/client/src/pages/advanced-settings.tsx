import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/top-header";
import MobileNav from "@/components/layout/mobile-nav";
import { 
  ArrowLeft, Shield, Bell, Eye, Smartphone, Globe, 
  Lock, Database, Palette, Accessibility, MapPin,
  Settings, Users, Zap, Download, Upload, Key,
  Clock, Moon, Sun, Volume, VolumeX, Wifi, WifiOff
} from "lucide-react";

export default function AdvancedSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: () => fetch("/api/settings", { credentials: 'include' }).then(res => res.json()),
  });

  const [localSettings, setLocalSettings] = useState({
    // Privacy & Visibility
    profileVisibility: "verified_neighbors",
    locationSharing: true,
    onlineStatus: true,
    showEmail: false,
    showPhone: false,
    showTrustScore: true,
    hideFromSearch: false,
    allowDirectMessages: true,
    requireVerificationForContact: false,
    
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    newMessages: true,
    emergencyAlerts: true,
    communityUpdates: false,
    gigNotifications: true,
    loopNotifications: true,
    vibeNotifications: true,
    havenNotifications: true,
    threadNotifications: true,
    nearbyActivityNotifications: true,
    
    // Communication
    emailFrequency: "daily",
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    autoResponderEnabled: false,
    autoResponderMessage: "",
    
    // App Preferences
    theme: "light",
    language: "english",
    fontSize: "medium",
    highContrast: false,
    reducedMotion: false,
    compactMode: false,
    
    // Location & Discovery
    searchRadius: 5,
    autoLocationUpdates: true,
    showDistanceInResults: true,
    preferLocalResults: true,
    mapStyle: "standard",
    
    // Safety & Security
    verificationBadgeVisible: true,
    backgroundCheckVisible: false,
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
    deviceTrustEnabled: true,
    
    // Community Features
    autoMatchmaking: true,
    skillsVisibility: "public",
    interestsVisibility: "public",
    allowGigRecommendations: true,
    allowVibeMatching: true,
    communityLeaderboardParticipation: true,
    
    // Data & Privacy
    dataRetention: "2years",
    analyticsOptOut: false,
    marketingOptOut: false,
    dataExportRequests: false,
    backupEnabled: true,
    syncAcrossDevices: true,
    
    // Advanced Features
    betaFeaturesEnabled: false,
    developerMode: false,
    apiAccessEnabled: false,
    webhooksEnabled: false,
  });

  // Update local settings when data loads
  useEffect(() => {
    if (settings) {
      setLocalSettings(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: (settingsData: any) => apiRequest("PUT", "/api/settings", settingsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Updated",
        description: "Your advanced settings have been saved successfully",
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

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(localSettings);
  };

  const updateSetting = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const exportData = () => {
    // Implement data export
    toast({
      title: "Data Export Started",
      description: "We'll email you a download link when your data is ready",
    });
  };

  const resetToDefaults = () => {
    setLocalSettings({
      profileVisibility: "verified_neighbors",
      locationSharing: true,
      onlineStatus: true,
      showEmail: false,
      showPhone: false,
      showTrustScore: true,
      hideFromSearch: false,
      allowDirectMessages: true,
      requireVerificationForContact: false,
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      newMessages: true,
      emergencyAlerts: true,
      communityUpdates: false,
      gigNotifications: true,
      loopNotifications: true,
      vibeNotifications: true,
      havenNotifications: true,
      threadNotifications: true,
      nearbyActivityNotifications: true,
      emailFrequency: "daily",
      quietHoursEnabled: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
      autoResponderEnabled: false,
      autoResponderMessage: "",
      theme: "light",
      language: "english",
      fontSize: "medium",
      highContrast: false,
      reducedMotion: false,
      compactMode: false,
      searchRadius: 5,
      autoLocationUpdates: true,
      showDistanceInResults: true,
      preferLocalResults: true,
      mapStyle: "standard",
      verificationBadgeVisible: true,
      backgroundCheckVisible: false,
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30,
      deviceTrustEnabled: true,
      autoMatchmaking: true,
      skillsVisibility: "public",
      interestsVisibility: "public",
      allowGigRecommendations: true,
      allowVibeMatching: true,
      communityLeaderboardParticipation: true,
      dataRetention: "2years",
      analyticsOptOut: false,
      marketingOptOut: false,
      dataExportRequests: false,
      backupEnabled: true,
      syncAcrossDevices: true,
      betaFeaturesEnabled: false,
      developerMode: false,
      apiAccessEnabled: false,
      webhooksEnabled: false,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:pl-72">
        <TopHeader />
        
        <main className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/settings">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Settings
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 font-poppins">Advanced Settings</h1>
                  <p className="text-gray-600">Customize your Hommiefi experience</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={resetToDefaults} variant="outline">
                  Reset to Defaults
                </Button>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={saveSettingsMutation.isPending}
                  className="bg-coral text-white hover:bg-coral/90"
                >
                  {saveSettingsMutation.isPending ? "Saving..." : "Save All Changes"}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="privacy" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="privacy" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="location" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Location</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Data</span>
                </TabsTrigger>
              </TabsList>

              {/* Privacy & Visibility Settings */}
              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Profile Visibility</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="profileVisibility">Who can see your profile</Label>
                        <Select 
                          value={localSettings.profileVisibility} 
                          onValueChange={(value) => updateSetting("profileVisibility", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Everyone</SelectItem>
                            <SelectItem value="verified_neighbors">Verified Neighbors Only</SelectItem>
                            <SelectItem value="friends_only">Friends Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="skillsVisibility">Skills visibility</Label>
                        <Select 
                          value={localSettings.skillsVisibility} 
                          onValueChange={(value) => updateSetting("skillsVisibility", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="verified_neighbors">Verified Neighbors</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showEmail">Show email address</Label>
                          <Switch
                            id="showEmail"
                            checked={localSettings.showEmail}
                            onCheckedChange={(checked) => updateSetting("showEmail", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showPhone">Show phone number</Label>
                          <Switch
                            id="showPhone"
                            checked={localSettings.showPhone}
                            onCheckedChange={(checked) => updateSetting("showPhone", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showTrustScore">Show trust score</Label>
                          <Switch
                            id="showTrustScore"
                            checked={localSettings.showTrustScore}
                            onCheckedChange={(checked) => updateSetting("showTrustScore", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="hideFromSearch">Hide from search results</Label>
                          <Switch
                            id="hideFromSearch"
                            checked={localSettings.hideFromSearch}
                            onCheckedChange={(checked) => updateSetting("hideFromSearch", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800">Communication Preferences</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allowDirectMessages">Allow direct messages</Label>
                          <Switch
                            id="allowDirectMessages"
                            checked={localSettings.allowDirectMessages}
                            onCheckedChange={(checked) => updateSetting("allowDirectMessages", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="requireVerificationForContact">Require verification to contact</Label>
                          <Switch
                            id="requireVerificationForContact"
                            checked={localSettings.requireVerificationForContact}
                            onCheckedChange={(checked) => updateSetting("requireVerificationForContact", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>Notification Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800">Delivery Methods</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pushNotifications">Push notifications</Label>
                          <Switch
                            id="pushNotifications"
                            checked={localSettings.pushNotifications}
                            onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailNotifications">Email notifications</Label>
                          <Switch
                            id="emailNotifications"
                            checked={localSettings.emailNotifications}
                            onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="smsNotifications">SMS notifications</Label>
                          <Switch
                            id="smsNotifications"
                            checked={localSettings.smsNotifications}
                            onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800">Feature Notifications</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="newMessages">New messages</Label>
                          <Switch
                            id="newMessages"
                            checked={localSettings.newMessages}
                            onCheckedChange={(checked) => updateSetting("newMessages", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emergencyAlerts">Emergency alerts</Label>
                          <Switch
                            id="emergencyAlerts"
                            checked={localSettings.emergencyAlerts}
                            onCheckedChange={(checked) => updateSetting("emergencyAlerts", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="gigNotifications">Gig updates</Label>
                          <Switch
                            id="gigNotifications"
                            checked={localSettings.gigNotifications}
                            onCheckedChange={(checked) => updateSetting("gigNotifications", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="loopNotifications">Loop activity</Label>
                          <Switch
                            id="loopNotifications"
                            checked={localSettings.loopNotifications}
                            onCheckedChange={(checked) => updateSetting("loopNotifications", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vibeNotifications">Vibe matches</Label>
                          <Switch
                            id="vibeNotifications"
                            checked={localSettings.vibeNotifications}
                            onCheckedChange={(checked) => updateSetting("vibeNotifications", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="havenNotifications">Haven groups</Label>
                          <Switch
                            id="havenNotifications"
                            checked={localSettings.havenNotifications}
                            onCheckedChange={(checked) => updateSetting("havenNotifications", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800">Quiet Hours</h4>
                      <div className="flex items-center justify-between mb-4">
                        <Label htmlFor="quietHoursEnabled">Enable quiet hours</Label>
                        <Switch
                          id="quietHoursEnabled"
                          checked={localSettings.quietHoursEnabled}
                          onCheckedChange={(checked) => updateSetting("quietHoursEnabled", checked)}
                        />
                      </div>
                      
                      {localSettings.quietHoursEnabled && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="quietHoursStart">Start time</Label>
                            <Input
                              id="quietHoursStart"
                              type="time"
                              value={localSettings.quietHoursStart}
                              onChange={(e) => updateSetting("quietHoursStart", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="quietHoursEnd">End time</Label>
                            <Input
                              id="quietHoursEnd"
                              type="time"
                              value={localSettings.quietHoursEnd}
                              onChange={(e) => updateSetting("quietHoursEnd", e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5" />
                      <span>Appearance & Accessibility</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <Select 
                          value={localSettings.theme} 
                          onValueChange={(value) => updateSetting("theme", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="auto">Auto (System)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="fontSize">Font size</Label>
                        <Select 
                          value={localSettings.fontSize} 
                          onValueChange={(value) => updateSetting("fontSize", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                            <SelectItem value="xlarge">Extra Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800">Accessibility</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="highContrast">High contrast mode</Label>
                          <Switch
                            id="highContrast"
                            checked={localSettings.highContrast}
                            onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="reducedMotion">Reduce motion</Label>
                          <Switch
                            id="reducedMotion"
                            checked={localSettings.reducedMotion}
                            onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="compactMode">Compact mode</Label>
                          <Switch
                            id="compactMode"
                            checked={localSettings.compactMode}
                            onCheckedChange={(checked) => updateSetting("compactMode", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* More tabs would continue here... */}
              
              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lock className="h-5 w-5" />
                      <span>Security & Safety</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="twoFactorEnabled">Two-factor authentication</Label>
                          <p className="text-sm text-gray-500">Add extra security to your account</p>
                        </div>
                        <Switch
                          id="twoFactorEnabled"
                          checked={localSettings.twoFactorEnabled}
                          onCheckedChange={(checked) => updateSetting("twoFactorEnabled", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="loginAlerts">Login alerts</Label>
                          <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                        </div>
                        <Switch
                          id="loginAlerts"
                          checked={localSettings.loginAlerts}
                          onCheckedChange={(checked) => updateSetting("loginAlerts", checked)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="sessionTimeout">Session timeout (minutes)</Label>
                        <div className="mt-2">
                          <Slider
                            value={[localSettings.sessionTimeout]}
                            onValueChange={(value) => updateSetting("sessionTimeout", value[0])}
                            min={5}
                            max={120}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>5 min</span>
                            <span>{localSettings.sessionTimeout} min</span>
                            <span>2 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Management */}
              <TabsContent value="data" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>Data Management</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dataRetention">Data retention period</Label>
                        <Select 
                          value={localSettings.dataRetention} 
                          onValueChange={(value) => updateSetting("dataRetention", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1year">1 Year</SelectItem>
                            <SelectItem value="2years">2 Years</SelectItem>
                            <SelectItem value="5years">5 Years</SelectItem>
                            <SelectItem value="forever">Forever</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Privacy Controls</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="analyticsOptOut">Opt out of analytics</Label>
                            <Switch
                              id="analyticsOptOut"
                              checked={localSettings.analyticsOptOut}
                              onCheckedChange={(checked) => updateSetting("analyticsOptOut", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="marketingOptOut">Opt out of marketing</Label>
                            <Switch
                              id="marketingOptOut"
                              checked={localSettings.marketingOptOut}
                              onCheckedChange={(checked) => updateSetting("marketingOptOut", checked)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Data Export & Management</h4>
                        <div className="flex space-x-3">
                          <Button onClick={exportData} variant="outline" className="flex items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Export My Data</span>
                          </Button>
                          <Button variant="outline" className="flex items-center space-x-2">
                            <Upload className="h-4 w-4" />
                            <span>Import Settings</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Sidebar />
      <MobileNav />
    </div>
  );
}
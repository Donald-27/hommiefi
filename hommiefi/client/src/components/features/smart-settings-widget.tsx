import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Link } from "wouter";
import { 
  Lightbulb, 
  Shield, 
  Bell, 
  MapPin, 
  Users, 
  Zap,
  TrendingUp,
  ChevronRight,
  Settings,
  CheckCircle
} from "lucide-react";

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  category: "privacy" | "community" | "safety" | "performance";
  action: string;
  priority: "high" | "medium" | "low";
  autoApply?: boolean;
}

interface SmartSettingsWidgetProps {
  userActivity?: {
    activeFeatures: string[];
    communityEngagement: number;
    safetyScore: number;
    privacyLevel: string;
  };
  onApplyRecommendation?: (recommendation: SmartRecommendation) => void;
}

export default function SmartSettingsWidget({ 
  userActivity = {
    activeFeatures: ["loop", "chat", "gigs"],
    communityEngagement: 78,
    safetyScore: 92,
    privacyLevel: "medium"
  },
  onApplyRecommendation 
}: SmartSettingsWidgetProps) {
  const [appliedRecommendations, setAppliedRecommendations] = useState<string[]>([]);

  // Generate smart recommendations based on user activity
  const generateRecommendations = (): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];

    // Privacy recommendations
    if (userActivity.privacyLevel === "low") {
      recommendations.push({
        id: "privacy-boost",
        title: "Boost Your Privacy",
        description: "Enable verification requirements for contacts to increase safety",
        category: "privacy",
        action: "Enable contact verification",
        priority: "high"
      });
    }

    // Community engagement recommendations
    if (userActivity.communityEngagement < 50) {
      recommendations.push({
        id: "community-engagement",
        title: "Increase Community Engagement",
        description: "Enable auto-matchmaking to find more neighbors with similar interests",
        category: "community",
        action: "Enable auto-matchmaking",
        priority: "medium"
      });
    }

    // Safety recommendations
    if (userActivity.safetyScore < 85) {
      recommendations.push({
        id: "safety-improvement",
        title: "Enhance Safety Features",
        description: "Enable two-factor authentication and login alerts for better security",
        category: "safety",
        action: "Enable 2FA",
        priority: "high"
      });
    }

    // Performance recommendations
    if (userActivity.activeFeatures.length > 5) {
      recommendations.push({
        id: "performance-optimization",
        title: "Optimize App Performance",
        description: "Enable compact mode to reduce data usage and improve speed",
        category: "performance",
        action: "Enable compact mode",
        priority: "low",
        autoApply: true
      });
    }

    // Notification optimization
    recommendations.push({
      id: "notification-optimization",
      title: "Smart Notification Settings",
      description: "Based on your usage, optimize notifications for peak engagement times",
      category: "performance",
      action: "Enable quiet hours (10 PM - 7 AM)",
      priority: "medium"
    });

    return recommendations;
  };

  const recommendations = generateRecommendations();

  const handleApplyRecommendation = (recommendation: SmartRecommendation) => {
    setAppliedRecommendations(prev => [...prev, recommendation.id]);
    onApplyRecommendation?.(recommendation);
  };

  const getCategoryIcon = (category: SmartRecommendation["category"]) => {
    switch (category) {
      case "privacy": return Shield;
      case "community": return Users;
      case "safety": return Shield;
      case "performance": return Zap;
      default: return Settings;
    }
  };

  const getCategoryColor = (category: SmartRecommendation["category"]) => {
    switch (category) {
      case "privacy": return "bg-blue-100 text-blue-800";
      case "community": return "bg-green-100 text-green-800";
      case "safety": return "bg-red-100 text-red-800";
      case "performance": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: SmartRecommendation["priority"]) => {
    switch (priority) {
      case "high": return "border-red-200 bg-red-50";
      case "medium": return "border-yellow-200 bg-yellow-50";
      case "low": return "border-blue-200 bg-blue-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Smart Insights Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-coral" />
            <span>Your Hommiefi Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-coral/10 rounded-lg">
              <div className="text-2xl font-bold text-coral">{userActivity.communityEngagement}%</div>
              <div className="text-sm text-gray-600">Community Engagement</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userActivity.safetyScore}%</div>
              <div className="text-sm text-gray-600">Safety Score</div>
            </div>
            <div className="text-center p-3 bg-teal/10 rounded-lg">
              <div className="text-2xl font-bold text-teal">{userActivity.activeFeatures.length}</div>
              <div className="text-sm text-gray-600">Active Features</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{appliedRecommendations.length}</div>
              <div className="text-sm text-gray-600">Optimizations Applied</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>Smart Recommendations</span>
            <Badge variant="secondary" className="ml-auto">
              {recommendations.filter(r => !appliedRecommendations.includes(r.id)).length} pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((recommendation) => {
            const Icon = getCategoryIcon(recommendation.category);
            const isApplied = appliedRecommendations.includes(recommendation.id);

            return (
              <div
                key={recommendation.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isApplied 
                    ? "border-green-200 bg-green-50" 
                    : getPriorityColor(recommendation.priority)
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <h4 className="font-medium text-gray-800">{recommendation.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={getCategoryColor(recommendation.category)}
                      >
                        {recommendation.category}
                      </Badge>
                      {recommendation.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">
                          High Priority
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{recommendation.description}</p>
                    <div className="flex items-center space-x-2">
                      {recommendation.autoApply && !isApplied && (
                        <Badge variant="outline" className="text-xs">
                          Auto-apply available
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {isApplied ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Applied</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleApplyRecommendation(recommendation)}
                        size="sm"
                        className="bg-coral text-white hover:bg-coral/90"
                      >
                        {recommendation.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Quick Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-between h-auto p-4" asChild>
              <Link href="/settings/advanced">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Advanced Settings</div>
                    <div className="text-sm text-gray-500">Full customization options</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" className="justify-between h-auto p-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Privacy Checkup</div>
                  <div className="text-sm text-gray-500">Review your privacy settings</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button variant="outline" className="justify-between h-auto p-4">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Notification Tuner</div>
                  <div className="text-sm text-gray-500">Optimize your alerts</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button variant="outline" className="justify-between h-auto p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Community Preferences</div>
                  <div className="text-sm text-gray-500">How you connect with neighbors</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function HelpoutButton() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createEmergencyMutation = useMutation({
    mutationFn: (requestData: any) => apiRequest("POST", "/api/emergency/requests", requestData),
    onSuccess: () => {
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["/api/emergency/requests"] });
      toast({
        title: "Help request sent!",
        description: "Neighbors in your area have been notified",
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending help request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateRequest = (formData: FormData) => {
    const requestData = {
      title: formData.get('title'),
      description: formData.get('description'),
      urgency: formData.get('urgency'),
      location: formData.get('location'),
    };

    createEmergencyMutation.mutate(requestData);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-600 text-white">
          <i className="fas fa-exclamation-triangle mr-2"></i>HelpOut
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">
            <i className="fas fa-exclamation-triangle mr-2"></i>Request Emergency Help
          </DialogTitle>
        </DialogHeader>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">
            <i className="fas fa-info-circle mr-2"></i>
            This will immediately notify neighbors in your area. For life-threatening emergencies, call 911 first.
          </p>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleCreateRequest(new FormData(e.currentTarget));
        }} className="space-y-4">
          <div>
            <Label htmlFor="title">What do you need help with?</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="Brief description of help needed" 
              required 
            />
          </div>
          <div>
            <Label htmlFor="description">Details</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Provide more details about the situation..." 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select name="urgency" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Can wait</SelectItem>
                  <SelectItem value="medium">Medium - Soon</SelectItem>
                  <SelectItem value="high">High - Urgent</SelectItem>
                  <SelectItem value="critical">Critical - Immediate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Your Location</Label>
              <Input 
                id="location" 
                name="location" 
                placeholder="Address or nearby landmark" 
                required 
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowModal(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-red-500 hover:bg-red-600" 
              disabled={createEmergencyMutation.isPending}
            >
              {createEmergencyMutation.isPending ? 'Sending...' : 'Send Help Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

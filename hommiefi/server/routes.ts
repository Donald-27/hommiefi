import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { seedDatabase } from "./seedData";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertLoopItemSchema,
  insertGigSchema,
  insertGigApplicationSchema,
  insertVibeSessionSchema,
  insertThreadPostSchema,
  insertMessageSchema,
  insertUserSettingsSchema,
} from "@shared/schema";
import { z } from "zod";

interface AuthenticatedRequest extends Express.Request {
  user?: any;
  body: any;
  params: any;
  query: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Loop routes
  app.get('/api/loop/items', async (req, res) => {
    try {
      const { category, userId } = req.query;
      const items = await storage.getLoopItems(
        category as string,
        userId as string
      );
      res.json(items);
    } catch (error) {
      console.error("Error fetching loop items:", error);
      res.status(500).json({ message: "Failed to fetch loop items" });
    }
  });

  app.post('/api/loop/items', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertLoopItemSchema.parse({
        ...req.body,
        userId,
      });

      const item = await storage.createLoopItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating loop item:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create loop item" });
    }
  });

  app.get('/api/loop/items/:id', async (req, res) => {
    try {
      const item = await storage.getLoopItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching loop item:", error);
      res.status(500).json({ message: "Failed to fetch loop item" });
    }
  });

  app.put('/api/loop/items/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const item = await storage.getLoopItem(req.params.id);
      if (!item || item.userId !== userId) {
        return res.status(404).json({ message: "Item not found or unauthorized" });
      }

      const updates = insertLoopItemSchema.partial().parse(req.body);
      const updated = await storage.updateLoopItem(req.params.id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating loop item:", error);
      res.status(500).json({ message: "Failed to update loop item" });
    }
  });

  // Gigs routes
  app.get('/api/gigs', async (req, res) => {
    try {
      const { category, userId } = req.query;
      const gigs = await storage.getGigs(
        category as string,
        userId as string
      );
      res.json(gigs);
    } catch (error) {
      console.error("Error fetching gigs:", error);
      res.status(500).json({ message: "Failed to fetch gigs" });
    }
  });

  app.post('/api/gigs', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertGigSchema.parse({
        ...req.body,
        userId,
      });

      const gig = await storage.createGig(validatedData);
      res.status(201).json(gig);
    } catch (error) {
      console.error("Error creating gig:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create gig" });
    }
  });

  app.post('/api/gigs/:id/apply', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertGigApplicationSchema.parse({
        ...req.body,
        gigId: req.params.id,
        userId,
      });

      const application = await storage.applyToGig(validatedData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error applying to gig:", error);
      res.status(500).json({ message: "Failed to apply to gig" });
    }
  });

  // Vibe routes
  app.get('/api/vibe/available', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const sessions = await storage.getAvailableVibeSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching vibe sessions:", error);
      res.status(500).json({ message: "Failed to fetch vibe sessions" });
    }
  });

  app.post('/api/vibe/session', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertVibeSessionSchema.parse({
        ...req.body,
        userId,
      });

      const session = await storage.createVibeSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating vibe session:", error);
      res.status(500).json({ message: "Failed to create vibe session" });
    }
  });

  app.put('/api/vibe/session', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updates = insertVibeSessionSchema.partial().parse(req.body);
      const session = await storage.updateVibeSession(userId, updates);
      res.json(session);
    } catch (error) {
      console.error("Error updating vibe session:", error);
      res.status(500).json({ message: "Failed to update vibe session" });
    }
  });

  app.delete('/api/vibe/session', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.deleteVibeSession(userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting vibe session:", error);
      res.status(500).json({ message: "Failed to delete vibe session" });
    }
  });

  // Thread routes
  app.get('/api/thread/posts', async (req, res) => {
    try {
      const { category } = req.query;
      const posts = await storage.getThreadPosts(category as string);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching thread posts:", error);
      res.status(500).json({ message: "Failed to fetch thread posts" });
    }
  });

  app.post('/api/thread/posts', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertThreadPostSchema.parse({
        ...req.body,
        userId,
      });

      const post = await storage.createThreadPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating thread post:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create thread post" });
    }
  });

  app.post('/api/thread/posts/:id/like', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.likeThreadPost(userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error liking thread post:", error);
      res.status(500).json({ message: "Failed to like thread post" });
    }
  });

  // Haven routes
  app.get('/api/haven/groups', async (req, res) => {
    try {
      const groups = await storage.getHavenGroups();
      res.json(groups);
    } catch (error) {
      console.error("Error fetching haven groups:", error);
      res.status(500).json({ message: "Failed to fetch haven groups" });
    }
  });

  app.post('/api/haven/groups/:id/join', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.joinHavenGroup(userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error joining haven group:", error);
      res.status(500).json({ message: "Failed to join haven group" });
    }
  });

  // Chat routes
  app.get('/api/chat/conversations', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/chat/conversations/:id/messages', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const messages = await storage.getConversationMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/chat/conversations/:id/messages', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertMessageSchema.parse({
        ...req.body,
        conversationId: req.params.id,
        userId,
      });

      const message = await storage.sendMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Notifications routes
  app.get('/api/notifications', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Settings routes
  app.get('/api/settings', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const settings = await storage.getUserSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put('/api/settings', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertUserSettingsSchema.parse({
        ...req.body,
        userId,
      });

      const settings = await storage.upsertUserSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Emergency/HelpOut routes
  app.post('/api/emergency/requests', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        urgency: z.enum(['low', 'medium', 'high', 'critical']),
        location: z.string().min(1),
      }).parse(req.body);

      // Create notification for emergency request
      const notification = await storage.createNotification({
        userId,
        type: 'emergency',
        title: `Emergency Help Request: ${validatedData.title}`,
        message: validatedData.description,
        entityId: JSON.stringify({
          urgency: validatedData.urgency,
          location: validatedData.location,
        }),
      });

      // In a real app, this would notify nearby users via push notifications/SMS
      console.log(`Emergency request created: ${validatedData.title} (${validatedData.urgency})`);

      res.status(201).json({ message: "Emergency request sent", notification });
    } catch (error) {
      console.error("Error creating emergency request:", error);
      res.status(500).json({ message: "Failed to create emergency request" });
    }
  });

  // Profile routes
  app.put('/api/profile', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updates = z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        bio: z.string().optional(),
        neighborhood: z.string().optional(),
      }).parse(req.body);

      const user = await storage.upsertUser({
        id: userId,
        ...updates,
        email: req.user.claims.email,
        profileImageUrl: req.user.claims.profile_image_url,
      });

      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Admin route to seed database with sample data
  app.post('/api/admin/seed', async (req, res) => {
    try {
      await seedDatabase();
      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ message: "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}

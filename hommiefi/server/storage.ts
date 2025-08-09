import {
  users,
  loopItems,
  gigs,
  gigApplications,
  vibeSessions,
  havenGroups,
  havenMemberships,
  threadPosts,
  threadPostLikes,
  threadComments,
  conversations,
  conversationParticipants,
  messages,
  notifications,
  userSettings,
  type User,
  type UpsertUser,
  type LoopItem,
  type InsertLoopItem,
  type Gig,
  type InsertGig,
  type GigApplication,
  type InsertGigApplication,
  type VibeSession,
  type InsertVibeSession,
  type HavenGroup,
  type InsertHavenGroup,
  type ThreadPost,
  type InsertThreadPost,
  type Message,
  type InsertMessage,
  type Notification,
  type InsertNotification,
  type UserSettings,
  type InsertUserSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, like, or, gt } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Loop operations
  createLoopItem(item: InsertLoopItem): Promise<LoopItem>;
  getLoopItems(category?: string, userId?: string): Promise<(LoopItem & { user: User })[]>;
  getLoopItem(id: string): Promise<(LoopItem & { user: User }) | undefined>;
  updateLoopItem(id: string, updates: Partial<InsertLoopItem>): Promise<LoopItem>;
  deleteLoopItem(id: string): Promise<void>;
  
  // Gigs operations
  createGig(gig: InsertGig): Promise<Gig>;
  getGigs(category?: string, userId?: string): Promise<(Gig & { user: User })[]>;
  getGig(id: string): Promise<(Gig & { user: User }) | undefined>;
  updateGig(id: string, updates: Partial<InsertGig>): Promise<Gig>;
  deleteGig(id: string): Promise<void>;
  applyToGig(application: InsertGigApplication): Promise<GigApplication>;
  getGigApplications(gigId: string): Promise<(GigApplication & { user: User })[]>;
  
  // Vibe operations
  createVibeSession(session: InsertVibeSession): Promise<VibeSession>;
  getVibeSession(userId: string): Promise<VibeSession | undefined>;
  updateVibeSession(userId: string, updates: Partial<InsertVibeSession>): Promise<VibeSession>;
  getAvailableVibeSessions(excludeUserId: string): Promise<(VibeSession & { user: User })[]>;
  deleteVibeSession(userId: string): Promise<void>;
  
  // Haven operations
  getHavenGroups(): Promise<HavenGroup[]>;
  createHavenGroup(group: InsertHavenGroup): Promise<HavenGroup>;
  joinHavenGroup(userId: string, groupId: string): Promise<void>;
  leaveHavenGroup(userId: string, groupId: string): Promise<void>;
  getUserHavenGroups(userId: string): Promise<HavenGroup[]>;
  
  // Thread operations
  createThreadPost(post: InsertThreadPost): Promise<ThreadPost>;
  getThreadPosts(category?: string): Promise<(ThreadPost & { user: User })[]>;
  getThreadPost(id: string): Promise<(ThreadPost & { user: User }) | undefined>;
  likeThreadPost(userId: string, postId: string): Promise<void>;
  unlikeThreadPost(userId: string, postId: string): Promise<void>;
  
  // Chat operations
  createConversation(participantIds: string[], type?: string, name?: string): Promise<{ id: string }>;
  getConversations(userId: string): Promise<any[]>;
  getConversationMessages(conversationId: string): Promise<(Message & { user: User })[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
  
  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Loop operations
  async createLoopItem(item: InsertLoopItem): Promise<LoopItem> {
    const [loopItem] = await db.insert(loopItems).values(item).returning();
    return loopItem;
  }

  async getLoopItems(category?: string, userId?: string): Promise<(LoopItem & { user: User })[]> {
    let query = db
      .select({
        id: loopItems.id,
        userId: loopItems.userId,
        title: loopItems.title,
        description: loopItems.description,
        category: loopItems.category,
        type: loopItems.type,
        status: loopItems.status,
        price: loopItems.price,
        imageUrls: loopItems.imageUrls,
        location: loopItems.location,
        availableFrom: loopItems.availableFrom,
        availableUntil: loopItems.availableUntil,
        createdAt: loopItems.createdAt,
        updatedAt: loopItems.updatedAt,
        user: users,
      })
      .from(loopItems)
      .innerJoin(users, eq(loopItems.userId, users.id))
      .orderBy(desc(loopItems.createdAt));

    if (category) {
      query = query.where(eq(loopItems.category, category));
    }

    if (userId) {
      query = query.where(eq(loopItems.userId, userId));
    }

    return await query;
  }

  async getLoopItem(id: string): Promise<(LoopItem & { user: User }) | undefined> {
    const [result] = await db
      .select({
        id: loopItems.id,
        userId: loopItems.userId,
        title: loopItems.title,
        description: loopItems.description,
        category: loopItems.category,
        type: loopItems.type,
        status: loopItems.status,
        price: loopItems.price,
        imageUrls: loopItems.imageUrls,
        location: loopItems.location,
        availableFrom: loopItems.availableFrom,
        availableUntil: loopItems.availableUntil,
        createdAt: loopItems.createdAt,
        updatedAt: loopItems.updatedAt,
        user: users,
      })
      .from(loopItems)
      .innerJoin(users, eq(loopItems.userId, users.id))
      .where(eq(loopItems.id, id));

    return result;
  }

  async updateLoopItem(id: string, updates: Partial<InsertLoopItem>): Promise<LoopItem> {
    const [updated] = await db
      .update(loopItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(loopItems.id, id))
      .returning();
    return updated;
  }

  async deleteLoopItem(id: string): Promise<void> {
    await db.delete(loopItems).where(eq(loopItems.id, id));
  }

  // Gigs operations
  async createGig(gig: InsertGig): Promise<Gig> {
    const [createdGig] = await db.insert(gigs).values(gig).returning();
    return createdGig;
  }

  async getGigs(category?: string, userId?: string): Promise<(Gig & { user: User })[]> {
    let query = db
      .select({
        id: gigs.id,
        userId: gigs.userId,
        title: gigs.title,
        description: gigs.description,
        category: gigs.category,
        hourlyRate: gigs.hourlyRate,
        fixedPrice: gigs.fixedPrice,
        status: gigs.status,
        scheduledDate: gigs.scheduledDate,
        duration: gigs.duration,
        skillsRequired: gigs.skillsRequired,
        location: gigs.location,
        isUrgent: gigs.isUrgent,
        createdAt: gigs.createdAt,
        updatedAt: gigs.updatedAt,
        user: users,
      })
      .from(gigs)
      .innerJoin(users, eq(gigs.userId, users.id))
      .orderBy(desc(gigs.createdAt));

    if (category) {
      query = query.where(eq(gigs.category, category));
    }

    if (userId) {
      query = query.where(eq(gigs.userId, userId));
    }

    return await query;
  }

  async getGig(id: string): Promise<(Gig & { user: User }) | undefined> {
    const [result] = await db
      .select({
        id: gigs.id,
        userId: gigs.userId,
        title: gigs.title,
        description: gigs.description,
        category: gigs.category,
        hourlyRate: gigs.hourlyRate,
        fixedPrice: gigs.fixedPrice,
        status: gigs.status,
        scheduledDate: gigs.scheduledDate,
        duration: gigs.duration,
        skillsRequired: gigs.skillsRequired,
        location: gigs.location,
        isUrgent: gigs.isUrgent,
        createdAt: gigs.createdAt,
        updatedAt: gigs.updatedAt,
        user: users,
      })
      .from(gigs)
      .innerJoin(users, eq(gigs.userId, users.id))
      .where(eq(gigs.id, id));

    return result;
  }

  async updateGig(id: string, updates: Partial<InsertGig>): Promise<Gig> {
    const [updated] = await db
      .update(gigs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(gigs.id, id))
      .returning();
    return updated;
  }

  async deleteGig(id: string): Promise<void> {
    await db.delete(gigs).where(eq(gigs.id, id));
  }

  async applyToGig(application: InsertGigApplication): Promise<GigApplication> {
    const [created] = await db.insert(gigApplications).values(application).returning();
    return created;
  }

  async getGigApplications(gigId: string): Promise<(GigApplication & { user: User })[]> {
    return await db
      .select({
        id: gigApplications.id,
        gigId: gigApplications.gigId,
        userId: gigApplications.userId,
        message: gigApplications.message,
        proposedRate: gigApplications.proposedRate,
        status: gigApplications.status,
        createdAt: gigApplications.createdAt,
        user: users,
      })
      .from(gigApplications)
      .innerJoin(users, eq(gigApplications.userId, users.id))
      .where(eq(gigApplications.gigId, gigId))
      .orderBy(desc(gigApplications.createdAt));
  }

  // Vibe operations
  async createVibeSession(session: InsertVibeSession): Promise<VibeSession> {
    const [created] = await db.insert(vibeSessions).values(session).returning();
    return created;
  }

  async getVibeSession(userId: string): Promise<VibeSession | undefined> {
    const [session] = await db.select().from(vibeSessions).where(eq(vibeSessions.userId, userId));
    return session;
  }

  async updateVibeSession(userId: string, updates: Partial<InsertVibeSession>): Promise<VibeSession> {
    const [updated] = await db
      .update(vibeSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(vibeSessions.userId, userId))
      .returning();
    return updated;
  }

  async getAvailableVibeSessions(excludeUserId: string): Promise<(VibeSession & { user: User })[]> {
    return await db
      .select({
        id: vibeSessions.id,
        userId: vibeSessions.userId,
        status: vibeSessions.status,
        mood: vibeSessions.mood,
        message: vibeSessions.message,
        availableUntil: vibeSessions.availableUntil,
        location: vibeSessions.location,
        createdAt: vibeSessions.createdAt,
        updatedAt: vibeSessions.updatedAt,
        user: users,
      })
      .from(vibeSessions)
      .innerJoin(users, eq(vibeSessions.userId, users.id))
      .where(
        and(
          eq(vibeSessions.status, 'available'),
          gt(vibeSessions.availableUntil, new Date()),
          sql`${vibeSessions.userId} != ${excludeUserId}`
        )
      )
      .orderBy(asc(vibeSessions.createdAt));
  }

  async deleteVibeSession(userId: string): Promise<void> {
    await db.delete(vibeSessions).where(eq(vibeSessions.userId, userId));
  }

  // Haven operations
  async getHavenGroups(): Promise<HavenGroup[]> {
    return await db.select().from(havenGroups).orderBy(asc(havenGroups.name));
  }

  async createHavenGroup(group: InsertHavenGroup): Promise<HavenGroup> {
    const [created] = await db.insert(havenGroups).values(group).returning();
    return created;
  }

  async joinHavenGroup(userId: string, groupId: string): Promise<void> {
    await db.insert(havenMemberships).values({ userId, groupId });
    await db
      .update(havenGroups)
      .set({ memberCount: sql`${havenGroups.memberCount} + 1` })
      .where(eq(havenGroups.id, groupId));
  }

  async leaveHavenGroup(userId: string, groupId: string): Promise<void> {
    await db.delete(havenMemberships)
      .where(and(
        eq(havenMemberships.userId, userId),
        eq(havenMemberships.groupId, groupId)
      ));
    await db
      .update(havenGroups)
      .set({ memberCount: sql`${havenGroups.memberCount} - 1` })
      .where(eq(havenGroups.id, groupId));
  }

  async getUserHavenGroups(userId: string): Promise<HavenGroup[]> {
    return await db
      .select({
        id: havenGroups.id,
        name: havenGroups.name,
        description: havenGroups.description,
        ageGroup: havenGroups.ageGroup,
        isPrivate: havenGroups.isPrivate,
        memberCount: havenGroups.memberCount,
        createdAt: havenGroups.createdAt,
      })
      .from(havenGroups)
      .innerJoin(havenMemberships, eq(havenGroups.id, havenMemberships.groupId))
      .where(eq(havenMemberships.userId, userId));
  }

  // Thread operations
  async createThreadPost(post: InsertThreadPost): Promise<ThreadPost> {
    const [created] = await db.insert(threadPosts).values(post).returning();
    return created;
  }

  async getThreadPosts(category?: string): Promise<(ThreadPost & { user: User })[]> {
    let query = db
      .select({
        id: threadPosts.id,
        userId: threadPosts.userId,
        title: threadPosts.title,
        content: threadPosts.content,
        category: threadPosts.category,
        imageUrls: threadPosts.imageUrls,
        likesCount: threadPosts.likesCount,
        commentsCount: threadPosts.commentsCount,
        isSticky: threadPosts.isSticky,
        createdAt: threadPosts.createdAt,
        updatedAt: threadPosts.updatedAt,
        user: users,
      })
      .from(threadPosts)
      .innerJoin(users, eq(threadPosts.userId, users.id))
      .orderBy(desc(threadPosts.isSticky), desc(threadPosts.createdAt));

    if (category) {
      query = query.where(eq(threadPosts.category, category));
    }

    return await query;
  }

  async getThreadPost(id: string): Promise<(ThreadPost & { user: User }) | undefined> {
    const [result] = await db
      .select({
        id: threadPosts.id,
        userId: threadPosts.userId,
        title: threadPosts.title,
        content: threadPosts.content,
        category: threadPosts.category,
        imageUrls: threadPosts.imageUrls,
        likesCount: threadPosts.likesCount,
        commentsCount: threadPosts.commentsCount,
        isSticky: threadPosts.isSticky,
        createdAt: threadPosts.createdAt,
        updatedAt: threadPosts.updatedAt,
        user: users,
      })
      .from(threadPosts)
      .innerJoin(users, eq(threadPosts.userId, users.id))
      .where(eq(threadPosts.id, id));

    return result;
  }

  async likeThreadPost(userId: string, postId: string): Promise<void> {
    await db.insert(threadPostLikes).values({ userId, postId }).onConflictDoNothing();
    await db
      .update(threadPosts)
      .set({ likesCount: sql`${threadPosts.likesCount} + 1` })
      .where(eq(threadPosts.id, postId));
  }

  async unlikeThreadPost(userId: string, postId: string): Promise<void> {
    await db.delete(threadPostLikes)
      .where(and(
        eq(threadPostLikes.userId, userId),
        eq(threadPostLikes.postId, postId)
      ));
    await db
      .update(threadPosts)
      .set({ likesCount: sql`${threadPosts.likesCount} - 1` })
      .where(eq(threadPosts.id, postId));
  }

  // Chat operations
  async createConversation(participantIds: string[], type = 'direct', name?: string): Promise<{ id: string }> {
    const [conversation] = await db.insert(conversations).values({ type, name }).returning();
    
    const participants = participantIds.map(userId => ({
      conversationId: conversation.id,
      userId,
    }));
    
    await db.insert(conversationParticipants).values(participants);
    return { id: conversation.id };
  }

  async getConversations(userId: string): Promise<any[]> {
    return await db
      .select({
        id: conversations.id,
        type: conversations.type,
        name: conversations.name,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
      })
      .from(conversations)
      .innerJoin(conversationParticipants, eq(conversations.id, conversationParticipants.conversationId))
      .where(eq(conversationParticipants.userId, userId))
      .orderBy(desc(conversations.lastMessageAt));
  }

  async getConversationMessages(conversationId: string): Promise<(Message & { user: User })[]> {
    return await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        userId: messages.userId,
        content: messages.content,
        messageType: messages.messageType,
        isAnonymous: messages.isAnonymous,
        createdAt: messages.createdAt,
        user: users,
      })
      .from(messages)
      .innerJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    
    // Update conversation last message time
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));
    
    return created;
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [upserted] = await db
      .insert(userSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          ...settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upserted;
  }
}

export const storage = new DatabaseStorage();

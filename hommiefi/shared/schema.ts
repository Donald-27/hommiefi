import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  primaryKey
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  bio: text("bio"),
  neighborhood: varchar("neighborhood"),
  city: varchar("city"),
  state: varchar("state"),
  country: varchar("country").default("United States"),
  isVerified: boolean("is_verified").default(false),
  trustScore: decimal("trust_score", { precision: 3, scale: 2 }).default("0.00"),
  communityPoints: integer("community_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loop items (community sharing)
export const loopItems = pgTable("loop_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  type: varchar("type").notNull(), // 'offer', 'request', 'swap'
  status: varchar("status").default("available"), // 'available', 'borrowed', 'unavailable'
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrls: text("image_urls").array(),
  location: varchar("location"),
  availableFrom: timestamp("available_from"),
  availableUntil: timestamp("available_until"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gigs (local tasks)
export const gigs = pgTable("gigs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  fixedPrice: decimal("fixed_price", { precision: 10, scale: 2 }),
  status: varchar("status").default("active"), // 'active', 'in_progress', 'completed', 'cancelled'
  scheduledDate: timestamp("scheduled_date"),
  duration: integer("duration"), // in hours
  skillsRequired: text("skills_required").array(),
  location: varchar("location"),
  isUrgent: boolean("is_urgent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gig applications
export const gigApplications = pgTable("gig_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gigId: varchar("gig_id").notNull().references(() => gigs.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message"),
  proposedRate: decimal("proposed_rate", { precision: 10, scale: 2 }),
  status: varchar("status").default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

// Vibe sessions (real-time social matching)
export const vibeSessions = pgTable("vibe_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: varchar("status").default("available"), // 'available', 'busy', 'offline'
  mood: varchar("mood"), // 'coffee', 'walk', 'games', 'food'
  message: text("message"),
  availableUntil: timestamp("available_until"),
  location: varchar("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Haven groups (mother communities)
export const havenGroups = pgTable("haven_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  ageGroup: varchar("age_group").notNull(), // 'newborn', 'toddler', 'preschool', 'school', 'teen', 'general'
  isPrivate: boolean("is_private").default(true),
  memberCount: integer("member_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Haven group memberships
export const havenMemberships = pgTable("haven_memberships", {
  userId: varchar("user_id").notNull().references(() => users.id),
  groupId: varchar("group_id").notNull().references(() => havenGroups.id),
  role: varchar("role").default("member"), // 'member', 'moderator', 'admin'
  joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.groupId] }),
}));

// Thread posts (community discussions)
export const threadPosts = pgTable("thread_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content"),
  category: varchar("category").notNull(), // 'announcement', 'tip', 'lost_found', 'recommendation'
  imageUrls: text("image_urls").array(),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  isSticky: boolean("is_sticky").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Thread post likes
export const threadPostLikes = pgTable("thread_post_likes", {
  userId: varchar("user_id").notNull().references(() => users.id),
  postId: varchar("post_id").notNull().references(() => threadPosts.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.postId] }),
}));

// Thread comments
export const threadComments = pgTable("thread_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => threadPosts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  parentId: varchar("parent_id"), // for nested comments
  likesCount: integer("likes_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat conversations
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").default("direct"), // 'direct', 'group', 'haven'
  name: varchar("name"),
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat participants
export const conversationParticipants = pgTable("conversation_participants", {
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastReadAt: timestamp("last_read_at"),
}, (table) => ({
  pk: primaryKey({ columns: [table.conversationId, table.userId] }),
}));

// Chat messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  messageType: varchar("message_type").default("text"), // 'text', 'image', 'system'
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message"),
  type: varchar("type").notNull(), // 'message', 'gig_application', 'loop_request', 'vibe_match'
  entityId: varchar("entity_id"), // reference to related entity
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User settings - Enhanced comprehensive settings
export const userSettings = pgTable("user_settings", {
  userId: varchar("user_id").primaryKey().references(() => users.id),
  
  // Privacy & Visibility Settings
  profileVisibility: varchar("profile_visibility").default("verified_neighbors"), // public, verified_neighbors, friends_only, private
  locationSharing: boolean("location_sharing").default(true),
  onlineStatus: boolean("online_status").default(true),
  showEmail: boolean("show_email").default(false),
  showPhone: boolean("show_phone").default(false),
  showTrustScore: boolean("show_trust_score").default(true),
  hideFromSearch: boolean("hide_from_search").default(false),
  allowDirectMessages: boolean("allow_direct_messages").default(true),
  requireVerificationForContact: boolean("require_verification_for_contact").default(false),
  
  // Notification Settings - Granular Control
  pushNotifications: boolean("push_notifications").default(true),
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  newMessages: boolean("new_messages").default(true),
  emergencyAlerts: boolean("emergency_alerts").default(true),
  communityUpdates: boolean("community_updates").default(false),
  gigNotifications: boolean("gig_notifications").default(true),
  loopNotifications: boolean("loop_notifications").default(true),
  vibeNotifications: boolean("vibe_notifications").default(true),
  havenNotifications: boolean("haven_notifications").default(true),
  threadNotifications: boolean("thread_notifications").default(true),
  nearbyActivityNotifications: boolean("nearby_activity_notifications").default(true),
  
  // Communication Preferences
  emailFrequency: varchar("email_frequency").default("daily"), // instant, hourly, daily, weekly, never
  quietHoursEnabled: boolean("quiet_hours_enabled").default(false),
  quietHoursStart: varchar("quiet_hours_start").default("22:00"),
  quietHoursEnd: varchar("quiet_hours_end").default("07:00"),
  autoResponderEnabled: boolean("auto_responder_enabled").default(false),
  autoResponderMessage: text("auto_responder_message"),
  
  // App Preferences
  theme: varchar("theme").default("light"), // light, dark, auto
  language: varchar("language").default("english"),
  fontSize: varchar("font_size").default("medium"), // small, medium, large, xlarge
  highContrast: boolean("high_contrast").default(false),
  reducedMotion: boolean("reduced_motion").default(false),
  compactMode: boolean("compact_mode").default(false),
  
  // Location & Discovery Settings
  searchRadius: integer("search_radius").default(5), // miles
  autoLocationUpdates: boolean("auto_location_updates").default(true),
  showDistanceInResults: boolean("show_distance_in_results").default(true),
  preferLocalResults: boolean("prefer_local_results").default(true),
  mapStyle: varchar("map_style").default("standard"), // standard, satellite, hybrid
  
  // Safety & Security
  verificationBadgeVisible: boolean("verification_badge_visible").default(true),
  backgroundCheckVisible: boolean("background_check_visible").default(false),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  loginAlerts: boolean("login_alerts").default(true),
  sessionTimeout: integer("session_timeout").default(30), // minutes
  deviceTrustEnabled: boolean("device_trust_enabled").default(true),
  
  // Community Features
  autoMatchmaking: boolean("auto_matchmaking").default(true),
  skillsVisibility: varchar("skills_visibility").default("public"), // public, verified_neighbors, private
  interestsVisibility: varchar("interests_visibility").default("public"),
  allowGigRecommendations: boolean("allow_gig_recommendations").default(true),
  allowVibeMatching: boolean("allow_vibe_matching").default(true),
  communityLeaderboardParticipation: boolean("community_leaderboard_participation").default(true),
  
  // Data & Privacy
  dataRetention: varchar("data_retention").default("2years"), // 1year, 2years, 5years, forever
  analyticsOptOut: boolean("analytics_opt_out").default(false),
  marketingOptOut: boolean("marketing_opt_out").default(false),
  dataExportRequests: boolean("data_export_requests").default(false),
  backupEnabled: boolean("backup_enabled").default(true),
  syncAcrossDevices: boolean("sync_across_devices").default(true),
  
  // Advanced Features
  betaFeaturesEnabled: boolean("beta_features_enabled").default(false),
  developerMode: boolean("developer_mode").default(false),
  apiAccessEnabled: boolean("api_access_enabled").default(false),
  webhooksEnabled: boolean("webhooks_enabled").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  loopItems: many(loopItems),
  gigs: many(gigs),
  gigApplications: many(gigApplications),
  vibeSessions: many(vibeSessions),
  threadPosts: many(threadPosts),
  havenMemberships: many(havenMemberships),
  messages: many(messages),
  notifications: many(notifications),
  settings: one(userSettings),
}));

export const loopItemsRelations = relations(loopItems, ({ one }) => ({
  user: one(users, { fields: [loopItems.userId], references: [users.id] }),
}));

export const gigsRelations = relations(gigs, ({ one, many }) => ({
  user: one(users, { fields: [gigs.userId], references: [users.id] }),
  applications: many(gigApplications),
}));

export const gigApplicationsRelations = relations(gigApplications, ({ one }) => ({
  gig: one(gigs, { fields: [gigApplications.gigId], references: [gigs.id] }),
  user: one(users, { fields: [gigApplications.userId], references: [users.id] }),
}));

export const vibeSessionsRelations = relations(vibeSessions, ({ one }) => ({
  user: one(users, { fields: [vibeSessions.userId], references: [users.id] }),
}));

export const threadPostsRelations = relations(threadPosts, ({ one, many }) => ({
  user: one(users, { fields: [threadPosts.userId], references: [users.id] }),
  comments: many(threadComments),
  likes: many(threadPostLikes),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, { fields: [messages.userId], references: [users.id] }),
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertLoopItem = typeof loopItems.$inferInsert;
export type LoopItem = typeof loopItems.$inferSelect;

export type InsertGig = typeof gigs.$inferInsert;
export type Gig = typeof gigs.$inferSelect;

export type InsertGigApplication = typeof gigApplications.$inferInsert;
export type GigApplication = typeof gigApplications.$inferSelect;

export type InsertVibeSession = typeof vibeSessions.$inferInsert;
export type VibeSession = typeof vibeSessions.$inferSelect;

export type InsertHavenGroup = typeof havenGroups.$inferInsert;
export type HavenGroup = typeof havenGroups.$inferSelect;

export type InsertThreadPost = typeof threadPosts.$inferInsert;
export type ThreadPost = typeof threadPosts.$inferSelect;

export type InsertMessage = typeof messages.$inferInsert;
export type Message = typeof messages.$inferSelect;

export type InsertNotification = typeof notifications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;

export type InsertUserSettings = typeof userSettings.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;

// Zod schemas
export const insertLoopItemSchema = createInsertSchema(loopItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGigSchema = createInsertSchema(gigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGigApplicationSchema = createInsertSchema(gigApplications).omit({
  id: true,
  createdAt: true,
});

export const insertVibeSessionSchema = createInsertSchema(vibeSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertThreadPostSchema = createInsertSchema(threadPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likesCount: true,
  commentsCount: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  createdAt: true,
  updatedAt: true,
});

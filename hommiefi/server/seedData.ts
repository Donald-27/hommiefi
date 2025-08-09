import { storage } from "./storage";

export async function seedDatabase() {
  try {
    console.log("Seeding database with sample data...");

    // Create sample users
    const user1 = await storage.upsertUser({
      id: "user-1",
      email: "mike@example.com",
      firstName: "Mike",
      lastName: "Rodriguez",
      bio: "Friendly neighbor who loves helping out with tools and home projects. DIY enthusiast and father of two.",
      neighborhood: "Downtown",
      trustScore: "4.8",
      communityPoints: "89",
    });

    const user2 = await storage.upsertUser({
      id: "user-2",
      email: "emma@example.com",
      firstName: "Emma",
      lastName: "Wilson",
      bio: "Coffee lover and book enthusiast. Always happy to share recommendations and help with childcare.",
      neighborhood: "Downtown",
      trustScore: "4.9",
      communityPoints: "76",
    });

    const user3 = await storage.upsertUser({
      id: "user-3",
      email: "lisa@example.com",
      firstName: "Lisa",
      lastName: "Chen",
      bio: "Professional tutor and community organizer. Love connecting neighbors and building friendships.",
      neighborhood: "Downtown",
      trustScore: "5.0",
      communityPoints: "124",
    });

    // Create sample loop items
    await storage.createLoopItem({
      userId: user1.id,
      title: "Power Drill Set",
      description: "Complete Dewalt power drill set with bits. Perfect for home projects and furniture assembly.",
      category: "tools",
      type: "offer",
      status: "available",
      location: "Downtown",
    });

    await storage.createLoopItem({
      userId: user2.id,
      title: "Children's Books Collection",
      description: "Beautiful collection of picture books for ages 3-8. Educational and entertaining stories.",
      category: "books",
      type: "offer",
      status: "available",
      location: "Downtown",
    });

    await storage.createLoopItem({
      userId: user3.id,
      title: "Looking for Baby Stroller",
      description: "Need a lightweight stroller for city walks. Good condition preferred.",
      category: "baby_gear",
      type: "request",
      status: "active",
      location: "Downtown",
    });

    // Create sample gigs
    await storage.createGig({
      userId: user1.id,
      title: "Dog Walking Service",
      description: "Reliable dog walking for busy professionals. 30-60 minute walks, flexible schedule.",
      category: "pet_care",
      hourlyRate: "25",
      status: "open",
      location: "Downtown",
      isUrgent: false,
    });

    await storage.createGig({
      userId: user2.id,
      title: "Math Tutoring for Kids",
      description: "Experienced tutor offering help with elementary and middle school math. Patient and encouraging approach.",
      category: "tutoring",
      hourlyRate: "30",
      status: "open",
      location: "Downtown",
      skillsRequired: ["Mathematics", "Teaching", "Patience"],
    });

    await storage.createGig({
      userId: user3.id,
      title: "Urgent: Babysitter Needed Tonight",
      description: "Need reliable babysitter for two kids (ages 5 and 8) from 6-10 PM. References required.",
      category: "childcare",
      hourlyRate: "20",
      status: "open",
      location: "Downtown",
      isUrgent: true,
    });

    // Create sample thread posts
    await storage.createThreadPost({
      userId: user1.id,
      title: "Neighborhood Block Party Planning",
      content: "Hi everyone! I'm organizing a block party for next month. Looking for volunteers to help with planning and setup. Let's bring our community together!",
      category: "announcement",
      likesCount: 12,
      commentsCount: 8,
    });

    await storage.createThreadPost({
      userId: user2.id,
      title: "Best Local Coffee Shops?",
      content: "New to the area and looking for great coffee recommendations. Any hidden gems I should know about?",
      category: "recommendation",
      likesCount: 7,
      commentsCount: 15,
    });

    await storage.createThreadPost({
      userId: user3.id,
      title: "Safety Tip: Lock Your Cars",
      content: "PSA: There have been reports of car break-ins on Oak Street. Please remember to lock your vehicles and don't leave valuables visible.",
      category: "tip",
      likesCount: 23,
      commentsCount: 5,
    });

    // Create sample vibe sessions
    await storage.createVibeSession({
      userId: user2.id,
      status: "available",
      mood: "coffee",
      message: "Looking for someone to grab coffee and chat about books!",
      availableUntil: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      location: "Downtown",
    });

    // Create sample haven groups
    const toddlerGroup = await storage.createHavenGroup({
      name: "Toddler Moms Support",
      description: "Support group for mothers of toddlers (1-3 years). Share experiences, tips, and encouragement.",
      ageGroup: "toddler",
      isPrivate: true,
      memberCount: 15,
    });

    const newbornGroup = await storage.createHavenGroup({
      name: "New Moms Circle",
      description: "Safe space for new mothers to connect, ask questions, and share the journey of early motherhood.",
      ageGroup: "newborn",
      isPrivate: true,
      memberCount: 8,
    });

    // Create sample conversations and messages
    const conversation = await storage.createConversation([user1.id, user2.id], "direct");
    
    await storage.sendMessage({
      conversationId: conversation.id,
      userId: user1.id,
      content: "Hi Emma! Thanks for letting me borrow those books. My kids loved them!",
      messageType: "text",
    });

    await storage.sendMessage({
      conversationId: conversation.id,
      userId: user2.id,
      content: "You're so welcome! I'm glad they enjoyed them. Feel free to borrow more anytime!",
      messageType: "text",
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
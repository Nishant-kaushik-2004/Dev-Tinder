// Dummy data for demonstration
export const dummyUsers = [
  {
    id: "6897bdf41e4f24ad7cf2c642",
    name: "Pokemon Singh",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "online",
    bio: "Full Stack Developer",
  },
  {
    id: "6897bb47fa836ccbd66bfea9",
    name: "Nishant Kaushik",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: "offline",
    bio: "React Native Expert",
  },
  {
    id: "6897bac1fa836ccbd66bfea0",
    name: "Striver Singh",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "online",
    bio: "UI/UX Designer",
  },
  {
    id: "6862d77aea6cf38bc6a61c94",
    name: "Virat Kohli",
    avatar: "https://i.pravatar.cc/150?img=4",
    status: "away",
    bio: "DevOps Engineer",
  },
  {
    id: "685461d2243e656138b4b537",
    name: "Koli Mittr",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "online",
    bio: "Python Developer",
  },
  {
    id: 6,
    name: "Ryan Foster",
    avatar: "https://i.pravatar.cc/150?img=6",
    status: "offline",
    bio: "Backend Specialist",
  },
  {
    id: 7,
    name: "Sophia Lee",
    avatar: "https://i.pravatar.cc/150?img=7",
    status: "online",
    bio: "Machine Learning Engineer",
  },
  {
    id: 8,
    name: "David Chen",
    avatar: "https://i.pravatar.cc/150?img=8",
    status: "away",
    bio: "Cloud Architect",
  },
];

export const dummyChats = [
  {
    userId: "6897bdf41e4f24ad7cf2c642",
    lastMessage: "Hey! Would love to collaborate on that React project",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    messages: [
      {
        id: 1,
        text: "Hi! I saw your profile, impressive work!",
        sender: "6897bdf41e4f24ad7cf2c642",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: true,
      },
      {
        id: 2,
        text: "Thanks! Your projects look amazing too",
        sender: "me",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        read: true,
      },
      {
        id: 3,
        text: "Would you be interested in collaborating?",
        sender: "6897bdf41e4f24ad7cf2c642",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        read: false,
      },
      {
        id: 4,
        text: "Hey! Would love to collaborate on that React project",
        sender: "6897bdf41e4f24ad7cf2c642",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
      },
    ],
  },
  {
    userId: "6897bac1fa836ccbd66bfea0",
    lastMessage: "Sure, let's discuss tomorrow",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    unreadCount: 0,
    messages: [
      {
        id: 1,
        text: "Quick question about the API integration",
        sender: "6897bac1fa836ccbd66bfea0",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        read: true,
      },
      {
        id: 2,
        text: "Which endpoint are you using?",
        sender: "me",
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        read: true,
      },
      {
        id: 3,
        text: "The REST API v2",
        sender: "6897bac1fa836ccbd66bfea0",
        timestamp: new Date(Date.now() - 1000 * 60 * 75),
        read: true,
      },
      {
        id: 4,
        text: "Sure, let's discuss tomorrow",
        sender: "me",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
      },
    ],
  },
  {
    userId: "6862d77aea6cf38bc6a61c94",
    lastMessage: "The designs are ready for review 🎨",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 1,
    messages: [
      {
        id: 1,
        text: "The designs are ready for review 🎨",
        sender: "6862d77aea6cf38bc6a61c94",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false,
      },
    ],
  },
  {
    userId: "685461d2243e656138b4b537",
    lastMessage: "Python > JavaScript 😄",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    messages: [
      {
        id: 1,
        text: "Python > JavaScript 😄",
        sender: "685461d2243e656138b4b537",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
      },
    ],
  },
];

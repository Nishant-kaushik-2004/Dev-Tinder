// Mock data for demonstration
export const mockConnections = [
  {
    _id: "conn1",
    fromUserId: "user1",
    toUserId: "currentUser",
    status: "accepted",
    createdAt: "2024-01-15T10:30:00Z",
    connectedUser: {
      _id: "user1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@example.com",
      age: 28,
      gender: "female",
      photoUrl:
        "https://physicaleducationandwellness.mit.edu/wp-content/uploads/Untitled-1.png",
      about: "Full-stack developer passionate about React and Node.js",
      skills: [
        "React",
        "Node.js",
        "Python",
        "TypeScript",
        "MongoDB",
        "AWS",
        "Docker",
        "GraphQL",
      ],
    },
  },
  {
    _id: "conn2",
    fromUserId: "currentUser",
    toUserId: "user2",
    status: "accepted",
    createdAt: "2024-01-10T14:20:00Z",
    connectedUser: {
      _id: "user2",
      firstName: "Alex",
      lastName: "Chen",
      email: "alex.chen@example.com",
      age: 25,
      gender: "male",
      photoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      about: "DevOps engineer who loves automation and cloud technologies",
      skills: ["AWS", "Docker", "Kubernetes", "Python"],
    },
  },
  {
    _id: "conn3",
    fromUserId: "user3",
    toUserId: "currentUser",
    status: "accepted",
    createdAt: "2024-01-08T09:15:00Z",
    connectedUser: {
      _id: "user3",
      firstName: "Emily",
      lastName: "Rodriguez",
      email: "emily.r@example.com",
      age: 30,
      gender: "female",
      photoUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      about: "UI/UX designer with a passion for creating beautiful interfaces",
      skills: ["Figma", "Adobe XD", "CSS", "JavaScript"],
    },
  },
  {
    _id: "conn4",
    fromUserId: "currentUser",
    toUserId: "user4",
    status: "accepted",
    createdAt: "2024-01-05T16:45:00Z",
    connectedUser: {
      _id: "user4",
      firstName: "Michael",
      lastName: "Thompson",
      email: "michael.t@example.com",
      age: 32,
      gender: "male",
      photoUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      about: "Senior backend engineer specializing in microservices",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
    },
  },
  {
    _id: "conn5",
    fromUserId: "user5",
    toUserId: "currentUser",
    status: "accepted",
    createdAt: "2024-01-01T12:00:00Z",
    connectedUser: {
      _id: "user5",
      firstName: "Jessica",
      lastName: "Park",
      email: "jessica.p@example.com",
      age: 26,
      gender: "female",
      photoUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      about: "Mobile app developer focusing on React Native and Flutter",
      skills: ["React Native", "Flutter", "iOS", "Android"],
    },
  },
];

// Mock data matching your API response structure
export const mockRequestsData = {
  message: "Fetched all pending connection requests successfully",
  requests: [
    {
      _id: "689ce686fad7bbd09d94465d",
      fromUserId: {
        _id: "6897bac1fa836ccbd66bfea0",
        firstName: "Sarah",
        lastName: "Johnson",
        photoUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        about:
          "Full-stack developer passionate about building scalable web applications with React and Node.js",
        skills: ["React", "Node.js", "TypeScript", "AWS"],
      },
      toUserId: "6862d7edea6cf38bc6a61c97",
      status: "interested",
      createdAt: "2025-08-13T19:24:54.238Z",
      updatedAt: "2025-08-13T19:24:54.238Z",
      __v: 0,
    },
    {
      _id: "689ce686fad7bbd09d94465e",
      fromUserId: {
        _id: "6897bac1fa836ccbd66bfea1",
        firstName: "Alex",
        lastName: "Chen",
        photoUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        about:
          "DevOps engineer specializing in cloud infrastructure and automation",
        skills: ["Docker", "Kubernetes", "Python", "Jenkins"],
      },
      toUserId: "6862d7edea6cf38bc6a61c97",
      status: "interested",
      createdAt: "2025-08-12T15:30:20.150Z",
      updatedAt: "2025-08-12T15:30:20.150Z",
      __v: 0,
    },
    {
      _id: "689ce686fad7bbd09d94465f",
      fromUserId: {
        _id: "6897bac1fa836ccbd66bfea2",
        firstName: "Emily",
        lastName: "Rodriguez",
        photoUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        about:
          "UI/UX Designer creating beautiful and intuitive user experiences",
        skills: ["Figma", "Adobe XD", "JavaScript", "CSS"],
      },
      toUserId: "6862d7edea6cf38bc6a61c97",
      status: "interested",
      createdAt: "2025-08-11T10:15:45.789Z",
      updatedAt: "2025-08-11T10:15:45.789Z",
      __v: 0,
    },
    {
      _id: "689ce686fad7bbd09d944660",
      fromUserId: {
        _id: "6897bac1fa836ccbd66bfea3",
        firstName: "Michael",
        lastName: "Thompson",
        photoUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        about:
          "Senior Backend Engineer with expertise in microservices and distributed systems",
        skills: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
      },
      toUserId: "6862d7edea6cf38bc6a61c97",
      status: "interested",
      createdAt: "2025-08-10T08:45:12.345Z",
      updatedAt: "2025-08-10T08:45:12.345Z",
      __v: 0,
    },
    {
      _id: "689ce686fad7bbd09d944661",
      fromUserId: {
        _id: "6897bac1fa836ccbd66bfea4",
        firstName: "Jessica",
        lastName: "Park",
        photoUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
        about:
          "Mobile App Developer crafting cross-platform solutions with React Native and Flutter",
        skills: ["React Native", "Flutter", "iOS", "Android"],
      },
      toUserId: "6862d7edea6cf38bc6a61c97",
      status: "interested",
      createdAt: "2025-08-09T14:22:33.567Z",
      updatedAt: "2025-08-09T14:22:33.567Z",
      __v: 0,
    },
  ],
};

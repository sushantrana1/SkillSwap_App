const mongoose = require("mongoose");
require("dotenv").config();

const Skill = require("../models/Skill");

const skills = [
  // Programming
  {
    name: "JavaScript",
    description: "Programming language used for web development",
    category: "Programming",
  },
  {
    name: "TypeScript",
    description: "Typed superset of JavaScript",
    category: "Programming",
  },
  {
    name: "Python",
    description: "General-purpose programming language",
    category: "Programming",
  },
  {
    name: "Java",
    description: "Object-oriented programming language",
    category: "Programming",
  },
  {
    name: "C",
    description: "General-purpose programming language",
    category: "Programming",
  },
  {
    name: "C++",
    description: "High-performance general-purpose programming language",
    category: "Programming",
  },
  {
    name: "C#",
    description: "Programming language commonly used with .NET",
    category: "Programming",
  },
  {
    name: "Go",
    description: "Programming language designed for scalable software",
    category: "Programming",
  },
  {
    name: "Rust",
    description: "Systems programming language focused on safety and performance",
    category: "Programming",
  },
  {
    name: "PHP",
    description: "Server-side scripting language for web development",
    category: "Programming",
  },
  {
    name: "Ruby",
    description: "Dynamic programming language",
    category: "Programming",
  },

  // Frontend
  {
    name: "HTML",
    description: "Markup language for creating web pages",
    category: "Frontend",
  },
  {
    name: "CSS",
    description: "Styling language for web interfaces",
    category: "Frontend",
  },
  {
    name: "React",
    description: "JavaScript library for building user interfaces",
    category: "Frontend",
  },
  {
    name: "Vue.js",
    description: "Progressive JavaScript framework for user interfaces",
    category: "Frontend",
  },
  {
    name: "Angular",
    description: "Framework for building web applications",
    category: "Frontend",
  },
  {
    name: "Next.js",
    description: "React framework for full-stack web development",
    category: "Frontend",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework",
    category: "Frontend",
  },
  {
    name: "Bootstrap",
    description: "Frontend framework for responsive websites",
    category: "Frontend",
  },
  {
    name: "Redux",
    description: "State management library for JavaScript applications",
    category: "Frontend",
  },
  {
    name: "Responsive Web Design",
    description: "Creating websites that adapt to different screen sizes",
    category: "Frontend",
  },

  // Backend
  {
    name: "Node.js",
    description: "JavaScript runtime for server-side development",
    category: "Backend",
  },
  {
    name: "Express.js",
    description: "Backend framework for Node.js",
    category: "Backend",
  },
  {
    name: "Django",
    description: "Python web framework",
    category: "Backend",
  },
  {
    name: "Flask",
    description: "Lightweight Python web framework",
    category: "Backend",
  },
  {
    name: "Spring Boot",
    description: "Java framework for building backend applications",
    category: "Backend",
  },
  {
    name: "REST API",
    description: "Designing and building RESTful APIs",
    category: "Backend",
  },
  {
    name: "GraphQL",
    description: "Query language and API technology",
    category: "Backend",
  },
  {
    name: "WebSockets",
    description: "Technology for real-time web communication",
    category: "Backend",
  },

  // Mobile
  {
    name: "React Native",
    description: "Framework for building cross-platform mobile applications",
    category: "Mobile",
  },
  {
    name: "Flutter",
    description: "Framework for building cross-platform applications",
    category: "Mobile",
  },
  {
    name: "Dart",
    description: "Programming language commonly used with Flutter",
    category: "Mobile",
  },
  {
    name: "Android Development",
    description: "Development of applications for Android devices",
    category: "Mobile",
  },
  {
    name: "iOS Development",
    description: "Development of applications for Apple devices",
    category: "Mobile",
  },

  // Database
  {
    name: "MongoDB",
    description: "NoSQL document database",
    category: "Database",
  },
  {
    name: "MySQL",
    description: "Relational database management system",
    category: "Database",
  },
  {
    name: "PostgreSQL",
    description: "Advanced open-source relational database",
    category: "Database",
  },
  {
    name: "SQLite",
    description: "Lightweight relational database",
    category: "Database",
  },
  {
    name: "Redis",
    description: "In-memory data store",
    category: "Database",
  },
  {
    name: "Database Design",
    description: "Designing efficient database structures",
    category: "Database",
  },
  {
    name: "SQL",
    description: "Language for managing relational databases",
    category: "Database",
  },

  // AI and Machine Learning
  {
    name: "Machine Learning",
    description: "Building systems that learn from data",
    category: "AI/ML",
  },
  {
    name: "Artificial Intelligence",
    description: "Developing intelligent computer systems",
    category: "AI/ML",
  },
  {
    name: "Deep Learning",
    description: "Machine learning using neural networks",
    category: "AI/ML",
  },
  {
    name: "Natural Language Processing",
    description: "Processing and understanding human language",
    category: "AI/ML",
  },
  {
    name: "Computer Vision",
    description: "Teaching computers to interpret visual information",
    category: "AI/ML",
  },
  {
    name: "TensorFlow",
    description: "Machine learning framework",
    category: "AI/ML",
  },
  {
    name: "PyTorch",
    description: "Machine learning and deep learning framework",
    category: "AI/ML",
  },
  {
    name: "Prompt Engineering",
    description: "Designing effective prompts for AI systems",
    category: "AI/ML",
  },

  // Data Science
  {
    name: "Data Science",
    description: "Extracting insights from data",
    category: "Data Science",
  },
  {
    name: "Data Analysis",
    description: "Analyzing data to discover useful insights",
    category: "Data Science",
  },
  {
    name: "Pandas",
    description: "Python library for data analysis",
    category: "Data Science",
  },
  {
    name: "NumPy",
    description: "Python library for numerical computing",
    category: "Data Science",
  },
  {
    name: "Data Visualization",
    description: "Presenting data through charts and visualizations",
    category: "Data Science",
  },
  {
    name: "Statistics",
    description: "Analyzing and interpreting data",
    category: "Data Science",
  },

  // DevOps
  {
    name: "Git",
    description: "Distributed version control system",
    category: "DevOps",
  },
  {
    name: "GitHub",
    description: "Platform for hosting and collaborating on code",
    category: "DevOps",
  },
  {
    name: "Docker",
    description: "Platform for containerizing applications",
    category: "DevOps",
  },
  {
    name: "Kubernetes",
    description: "Platform for managing containerized applications",
    category: "DevOps",
  },
  {
    name: "CI/CD",
    description: "Automating software integration and deployment",
    category: "DevOps",
  },
  {
    name: "Linux",
    description: "Open-source operating system",
    category: "DevOps",
  },

  // Cloud
  {
    name: "AWS",
    description: "Cloud computing platform by Amazon",
    category: "Cloud",
  },
  {
    name: "Microsoft Azure",
    description: "Cloud computing platform by Microsoft",
    category: "Cloud",
  },
  {
    name: "Google Cloud",
    description: "Cloud computing platform by Google",
    category: "Cloud",
  },
  {
    name: "Cloud Computing",
    description: "Using remote infrastructure and services over the internet",
    category: "Cloud",
  },

  // UI/UX
  {
    name: "UI Design",
    description: "Designing user interfaces for digital products",
    category: "UI/UX",
  },
  {
    name: "UX Design",
    description: "Designing user experiences",
    category: "UI/UX",
  },
  {
    name: "Figma",
    description: "Collaborative interface design tool",
    category: "UI/UX",
  },
  {
    name: "Wireframing",
    description: "Creating structural layouts for digital interfaces",
    category: "UI/UX",
  },
  {
    name: "Prototyping",
    description: "Creating interactive product prototypes",
    category: "UI/UX",
  },
  {
    name: "User Research",
    description: "Researching user needs and behavior",
    category: "UI/UX",
  },

  // Graphic Design
  {
    name: "Graphic Design",
    description: "Creating visual designs for digital and print media",
    category: "Graphic Design",
  },
  {
    name: "Adobe Photoshop",
    description: "Image editing and graphic design software",
    category: "Graphic Design",
  },
  {
    name: "Adobe Illustrator",
    description: "Vector graphics and illustration software",
    category: "Graphic Design",
  },
  {
    name: "Canva",
    description: "Online graphic design platform",
    category: "Graphic Design",
  },
  {
    name: "Logo Design",
    description: "Creating logos and brand identities",
    category: "Graphic Design",
  },
  {
    name: "Brand Design",
    description: "Creating visual identities for brands",
    category: "Graphic Design",
  },

  // Digital Marketing
  {
    name: "Digital Marketing",
    description: "Marketing products and services through digital channels",
    category: "Marketing",
  },
  {
    name: "SEO",
    description: "Optimizing websites for search engines",
    category: "Marketing",
  },
  {
    name: "Social Media Marketing",
    description: "Marketing through social media platforms",
    category: "Marketing",
  },
  {
    name: "Content Marketing",
    description: "Using content to attract and engage audiences",
    category: "Marketing",
  },
  {
    name: "Email Marketing",
    description: "Marketing through email campaigns",
    category: "Marketing",
  },
  {
    name: "Google Ads",
    description: "Online advertising through Google",
    category: "Marketing",
  },
  {
    name: "Copywriting",
    description: "Writing persuasive marketing content",
    category: "Marketing",
  },

  // Business
  {
    name: "Entrepreneurship",
    description: "Building and managing new businesses",
    category: "Business",
  },
  {
    name: "Business Strategy",
    description: "Planning and executing business strategies",
    category: "Business",
  },
  {
    name: "Project Management",
    description: "Planning and managing projects",
    category: "Business",
  },
  {
    name: "Product Management",
    description: "Managing the development of products",
    category: "Business",
  },
  {
    name: "Leadership",
    description: "Leading teams and organizations",
    category: "Business",
  },
  {
    name: "Public Speaking",
    description: "Presenting ideas effectively to an audience",
    category: "Business",
  },
  {
    name: "Negotiation",
    description: "Reaching agreements through effective communication",
    category: "Business",
  },

  // Languages
  {
    name: "English",
    description: "English language communication",
    category: "Languages",
  },
  {
    name: "Nepali",
    description: "Nepali language communication",
    category: "Languages",
  },
  {
    name: "Hindi",
    description: "Hindi language communication",
    category: "Languages",
  },
  {
    name: "Spanish",
    description: "Spanish language communication",
    category: "Languages",
  },
  {
    name: "French",
    description: "French language communication",
    category: "Languages",
  },
  {
    name: "German",
    description: "German language communication",
    category: "Languages",
  },
  {
    name: "Japanese",
    description: "Japanese language communication",
    category: "Languages",
  },
  {
    name: "Chinese",
    description: "Chinese language communication",
    category: "Languages",
  },

  // Photography and Video
  {
    name: "Photography",
    description: "Taking and composing photographs",
    category: "Photography",
  },
  {
    name: "Portrait Photography",
    description: "Photography focused on people and portraits",
    category: "Photography",
  },
  {
    name: "Landscape Photography",
    description: "Photography focused on landscapes and environments",
    category: "Photography",
  },
  {
    name: "Video Editing",
    description: "Editing and producing video content",
    category: "Video",
  },
  {
    name: "Adobe Premiere Pro",
    description: "Professional video editing software",
    category: "Video",
  },
  {
    name: "After Effects",
    description: "Motion graphics and visual effects software",
    category: "Video",
  },
  {
    name: "YouTube",
    description: "Creating and managing YouTube content",
    category: "Video",
  },

  // Music
  {
    name: "Music Production",
    description: "Creating and producing music",
    category: "Music",
  },
  {
    name: "Guitar",
    description: "Playing and teaching guitar",
    category: "Music",
  },
  {
    name: "Piano",
    description: "Playing and teaching piano",
    category: "Music",
  },
  {
    name: "Singing",
    description: "Vocal performance and singing",
    category: "Music",
  },
  {
    name: "Music Theory",
    description: "Understanding musical concepts and composition",
    category: "Music",
  },

  // Writing
  {
    name: "Creative Writing",
    description: "Writing stories, fiction, and creative content",
    category: "Writing",
  },
  {
    name: "Blog Writing",
    description: "Writing articles and blog content",
    category: "Writing",
  },
  {
    name: "Technical Writing",
    description: "Creating technical documentation and guides",
    category: "Writing",
  },
  {
    name: "Storytelling",
    description: "Communicating ideas through compelling stories",
    category: "Writing",
  },

  // Personal Development
  {
    name: "Time Management",
    description: "Managing time and priorities effectively",
    category: "Personal Development",
  },
  {
    name: "Communication",
    description: "Improving interpersonal and professional communication",
    category: "Personal Development",
  },
  {
    name: "Critical Thinking",
    description: "Analyzing information and solving problems logically",
    category: "Personal Development",
  },
  {
    name: "Career Development",
    description: "Planning and improving professional growth",
    category: "Personal Development",
  },
];

const seedSkills = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Skill.deleteMany({});

    console.log("Existing skills removed");

    const createdSkills = await Skill.insertMany(skills);

    console.log(
      `${createdSkills.length} skills inserted successfully`
    );

    createdSkills.forEach((skill) => {
      console.log(`- ${skill.name} (${skill.category})`);
    });

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Seed skills error:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedSkills();
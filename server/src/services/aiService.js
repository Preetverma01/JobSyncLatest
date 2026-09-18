const ROLE_SKILLS = {
  "Software Engineer": [
    "javascript",
    "python",
    "java",
    "c++",
    "sql",
    "data structures",
    "algorithms",
    "system design",
    "git",
    "testing",
  ],
  "Full Stack Developer": [
    "html",
    "css",
    "javascript",
    "react",
    "node.js",
    "express",
    "mongodb",
    "sql",
    "api",
    "git",
  ],
  "Frontend Developer": [
    "html",
    "css",
    "javascript",
    "react",
    "tailwind",
    "typescript",
    "ui design",
    "responsive design",
    "accessibility",
  ],
  "Backend Developer": [
    "node.js",
    "express",
    "mongodb",
    "sql",
    "api",
    "rest",
    "authentication",
    "redis",
    "microservices",
    "docker",
  ],
  "Data Analyst": [
    "excel",
    "sql",
    "python",
    "statistics",
    "power bi",
    "tableau",
    "data cleaning",
    "dashboarding",
  ],
  "Data Scientist": [
    "python",
    "sql",
    "machine learning",
    "statistics",
    "pandas",
    "numpy",
    "data visualization",
    "experiments",
    "model evaluation",
  ],
  "AI Engineer": [
    "python",
    "machine learning",
    "deep learning",
    "pytorch",
    "tensorflow",
    "nlp",
    "model deployment",
    "data pipelines",
    "mLOps",
  ],
  "Cyber Security Engineer": [
    "network security",
    "linux",
    "python",
    "cybersecurity",
    "security tools",
    "siem",
    "firewall",
    "threat analysis",
    "penetration testing",
  ],
};

const ROLE_PROJECTS = {
  "Software Engineer": [
    "Build a task manager with backend APIs and unit tests.",
    "Create a system design project like a URL shortener.",
    "Develop a coding challenge platform with user authentication.",
  ],
  "Full Stack Developer": [
    "Job portal with authentication, dashboard, and admin panel.",
    "Chat application with rooms, real-time updates, and database integration.",
    "LMS system with course enrollment and content management.",
  ],
  "Frontend Developer": [
    "Portfolio website with dark mode and smooth animations.",
    "Weather app with geolocation and forecast dashboard.",
    "E-commerce UI with product filters and cart logic.",
  ],
  "Backend Developer": [
    "REST API for a booking or inventory management system.",
    "Authentication service with JWT and role-based access control.",
    "API gateway or microservice project with caching and monitoring.",
  ],
  "Data Analyst": [
    "Sales dashboard with KPI tracking and trend analysis.",
    "Customer churn analysis using Python and SQL.",
    "Interactive dashboard in Power BI or Tableau.",
  ],
  "Data Scientist": [
    "Predictive model for customer behavior or churn.",
    "End-to-end ML project with data preprocessing and evaluation.",
    "Realtime recommendation engine or sentiment analysis pipeline.",
  ],
  "AI Engineer": [
    "Deploy a text classification model using Flask or FastAPI.",
    "Create an NLP pipeline for summarization or Q&A. ",
    "Build a MLOps project with monitoring and retraining flow.",
  ],
  "Cyber Security Engineer": [
    "Build a security monitoring dashboard for suspicious activities.",
    "Create a vulnerability scanner or log-analysis project.",
    "Design a secure authentication and network defense workflow.",
  ],
};

const CERTIFICATIONS = {
  "Software Engineer": [
    "AWS Certified Developer – Associate",
    "Coursera: Google IT Automation with Python",
    "Udemy: JavaScript Algorithms and Data Structures",
  ],
  "Full Stack Developer": [
    "Meta Front-End Developer Certificate",
    "AWS Certified Cloud Practitioner",
    "MongoDB Associate Developer",
  ],
  "Frontend Developer": [
    "Meta Front-End Developer Certificate",
    "Google UX Design Certificate",
    "Udemy: Advanced React and Tailwind",
  ],
  "Backend Developer": [
    "AWS Certified Developer – Associate",
    "MongoDB Associate Developer",
    "Coursera: Backend Development with Node.js",
  ],
  "Data Analyst": [
    "Google Data Analytics Certificate",
    "Microsoft Power BI Data Analyst",
    "IBM Data Analyst Professional Certificate",
  ],
  "Data Scientist": [
    "IBM Data Science Professional Certificate",
    "Google Advanced Data Analytics",
    "AWS Machine Learning Specialty",
  ],
  "AI Engineer": [
    "IBM AI Developer Professional Certificate",
    "Google Machine Learning Crash Course",
    "AWS Machine Learning Engineer Certificate",
  ],
  "Cyber Security Engineer": [
    "CompTIA Security+",
    "Certified Ethical Hacker (CEH)",
    "Microsoft Security Operations Analyst",
  ],
};

const RESOURCES = {
  "Software Engineer": [
    "LeetCode patterns and data structures practice",
    "System Design Primer",
    "Clean Code by Robert C. Martin",
  ],
  "Full Stack Developer": [
    "MDN Web Docs",
    "Node.js official docs",
    "MongoDB University",
  ],
  "Frontend Developer": [
    "Frontend Mentor",
    "CSS-Tricks",
    "React docs",
  ],
  "Backend Developer": [
    "Express documentation",
    "REST API design tutorials",
    "Postman Academy",
  ],
  "Data Analyst": [
    "SQLBolt",
    "Kaggle learning tracks",
    "Power BI documentation",
  ],
  "Data Scientist": [
    "Kaggle",
    "fast.ai",
    "Coursera ML Specialization",
  ],
  "AI Engineer": [
    "Hugging Face courses",
    "PyTorch tutorials",
    "Google ML Crash Course",
  ],
  "Cyber Security Engineer": [
    "TryHackMe",
    "Cyber Mentor",
    "OWASP learning resources",
  ],
};

const getRoleSkills = (role) => ROLE_SKILLS[role] || ROLE_SKILLS["Software Engineer"];

const normalizeSkill = (skill = "") =>
  String(skill).toLowerCase().replace(/[^a-z0-9+\s.]/g, "").trim();

export const extractSkillsFromText = (text) => {
  const skillTerms = Object.values(ROLE_SKILLS)
    .flat()
    .map((skill) => skill.toLowerCase());

  const found = new Set();
  const lowerText = text.toLowerCase();

  for (const skill of skillTerms) {
    if (lowerText.includes(skill)) {
      found.add(skill);
    }
  }

  return [...found].slice(0, 20);
};

export const compareSkillsWithRole = (userSkills, role) => {
  const requiredSkills = getRoleSkills(role).map(normalizeSkill);
  const existingSkills = [...new Set(userSkills.map(normalizeSkill))].filter(
    (skill) => requiredSkills.includes(skill) && skill
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !existingSkills.includes(skill)
  );

  return {
    existingSkills,
    missingSkills,
  };
};

export const generateRoadmap = (role, missingSkills) => {
  const baseRoadmap = [
    {
      week: "Week 1",
      topics: [
        `Core fundamentals for ${role}`,
        ...missingSkills.slice(0, 2),
      ],
      tasks: [
        "Set up a practice environment and notes repository.",
        "Complete 3 beginner exercises for core concepts.",
      ],
      project: `Build a basic project focused on ${role.toLowerCase()} fundamentals.`,
    },
    {
      week: "Week 2",
      topics: [
        "Practical implementation patterns",
        ...missingSkills.slice(2, 4),
      ],
      tasks: [
        "Build mini modules with real code examples.",
        "Solve 5 hands-on coding challenges.",
      ],
      project: "Create a small project integrating the learning topics.",
    },
    {
      week: "Week 3",
      topics: [
        "Application architecture and tooling",
        ...missingSkills.slice(4, 6),
      ],
      tasks: [
        "Practice debugging and deployment workflows.",
        "Review and refactor previous work.",
      ],
      project: "Develop a feature-rich project simulating real-world usage.",
    },
    {
      week: "Week 4",
      topics: [
        "Portfolio polishing and interview readiness",
        ...missingSkills.slice(6, 8),
      ],
      tasks: [
        "Write documentation and optimize your GitHub profile.",
        "Practice system design and technical interviews.",
      ],
      project: "Prepare a polished portfolio project and mock interview practice set.",
    },
  ];

  return baseRoadmap;
};

export const generateRoleInsights = (role) => ({
  projects: ROLE_PROJECTS[role] || ROLE_PROJECTS["Software Engineer"],
  certifications: CERTIFICATIONS[role] || CERTIFICATIONS["Software Engineer"],
  resources: RESOURCES[role] || RESOURCES["Software Engineer"],
});

export const calculateReadinessScore = ({
  skillsCoverage,
  resumeQuality,
  projects,
  experience,
  certifications,
}) => {
  const total =
    Number(skillsCoverage || 0) +
    Number(resumeQuality || 0) +
    Number(projects || 0) +
    Number(experience || 0) +
    Number(certifications || 0);

  return Math.min(100, Math.max(0, Math.round(total / 5)));
};

export default {
  extractSkillsFromText,
  compareSkillsWithRole,
  generateRoadmap,
  generateRoleInsights,
  calculateReadinessScore,
};

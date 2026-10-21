/**
 * All portfolio content lives here.
 * Edit this file to update your site — no digging through components.
 */

export const siteConfig = {
  name: "Deghne Gabriel Agana",
  handle: "gabz.io",
  role: "Front-end Developer",
  introLine:
    "I'm Deghne Gabriel Agana, a third-year IT student at the University of San Agustin who builds front-end. Design got me in. Animation keeps me here.",
  heroPhoto: "/picture/formal.png",
  casualPhoto: "/picture/DSC03695.JPG",
  resumeUrl: "/files/resume.pdf", // place your resume PDF in /public/files/
} as const;

export interface Project {
  slug: string;
  title: string;
  type?: string;
  year?: number;
  description: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
}

export const projects: Project[] = [
  {
    slug: "itsa-website",
    title: "ITSA Website",
    type: "Web Dev",
    year: 2026,
    description:
      "The official website of the Information Technology Student Association at the University of San Agustin. It helps students connect, learn, and grow together.",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://itsa-website-psi.vercel.app/",
    repoUrl: "https://github.com/JustineSalinas/ITSA-Website",
    image: "/projects/itsa.png",
  },
  {
    slug: "fragrance-vault",
    title: "FragranceVault",
    type: "Personal Project",
    year: 2026,
    description: "A digital catalog and personal vault for my fragrance collection.",
    tech: ["React", "Next.js", "Tailwind CSS"],
    liveUrl: "#",
    repoUrl: "https://github.com/DeghneG/FragranceVault",
    image: "/projects/gabfrag-vault.png",
    imagePosition: "object-left-top",
  },
  {
    slug: "quest-log",
    title: "The Quest Log of Gab",
    type: "Personal Project",
    year: 2026,
    description: "A comprehensive compilation of competitive gaming logs, stats, and configurations across multiple titles.",
    tech: ["React", "Next.js", "Tailwind CSS"],
    liveUrl: "#",
    repoUrl: "https://github.com/DeghneG/QuestLog",
    image: "/projects/quest-log.png",
    imageAlt: "Screenshot of The Quest Log of Gab hero section",
  },
];

export interface Skill {
  name: string;
  /** Accent color token name from the palette */
  color: "teal" | "mustard" | "orange" | "wine" | "mint";
}

export interface SkillCategory {
  category: string;
  accent: "teal" | "mustard" | "orange" | "wine" | "mint";
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Frontend",
    accent: "teal",
    skills: [
      { name: "React", color: "teal" },
      { name: "Next.js", color: "mustard" },
      { name: "TypeScript", color: "orange" },
      { name: "Tailwind CSS", color: "mint" },
      { name: "GSAP", color: "teal" },
      { name: "Three.js", color: "orange" },
      { name: "Framer Motion", color: "mustard" },
    ],
  },
  {
    category: "Backend",
    accent: "mustard",
    skills: [
      { name: "Node.js", color: "teal" },
      { name: "Python", color: "mustard" },
      { name: "Supabase", color: "orange" },
      { name: "WordPress", color: "mint" },
    ],
  },
  {
    category: "Developer Tools",
    accent: "orange",
    skills: [
      { name: "GitHub", color: "mustard" },
      { name: "Vercel", color: "mint" },
      { name: "Canva", color: "orange" },
    ],
  },
  {
    category: "AIs",
    accent: "mint",
    skills: [
      { name: "Claude", color: "teal" },
      { name: "ChatGPT", color: "mustard" },
      { name: "Gemini", color: "mint" },
    ],
  },
];

export interface TimelineEntry {
  type: "education" | "work" | "certification";
  title: string;
  org: string;
  location: string;
  period: string;
  description?: string;
}

export const timeline: TimelineEntry[] = [
  {
    type: "education",
    title: "Junior High School (Grade 7–10)",
    org: "BED University of San Agustin",
    location: "Iloilo City",
    period: "2018 – 2022",
  },
  {
    type: "education",
    title: "Senior High School (Grade 11–12)",
    org: "University of San Agustin Main",
    location: "Iloilo City",
    period: "2022 – 2024",
  },
  {
    type: "education",
    title: "BS Information Technology (3rd Year)",
    org: "University of San Agustin Main",
    location: "Iloilo City",
    period: "2024 – Present",
  },
];

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  category: string;
  url?: string;
  description?: string;
}

export const certifications: Certification[] = [
  {
    title: "AI Prompts Fundamentals",
    issuer: "Coddy",
    year: "2026",
    category: "AI",
    url: "/certificates/ai-prompts-fundamentals.pdf",
    description: "Certificate of Completion covering prompt engineering fundamentals and generative AI workflows.",
  },
  {
    title: "Certification Title Two",
    issuer: "Issuer Name",
    year: "2025",
    category: "Design",
    url: "",
    description: "UI/UX design systems, component architecture, and interaction states.",
  },
  {
    title: "Certification Title Three",
    issuer: "Issuer Name",
    year: "2025",
    category: "Web Dev",
    url: "",
    description: "Modern web application development and responsive design.",
  },
  {
    title: "Certification Title Four",
    issuer: "Issuer Name",
    year: "2024",
    category: "Tools",
    url: "",
    description: "Developer tooling, workflow automation, and version control.",
  },
];

export const contact = {
  email: "deghneagana@gmail.com",
  github: "https://github.com/DeghneG",
  phone: [
    { label: "Globe", number: "0977 024 8366" },
    { label: "Smart", number: "0961 776 8196" },
  ],
} as const;

export const GITHUB_USERNAME = "DeghneG";


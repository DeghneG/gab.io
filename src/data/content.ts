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
  heroPhoto: "/images/hero-photo.jpg", // replace with your actual photo
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
    type: "Organization site",
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
  color: "teal" | "mustard" | "orange" | "wine";
}

export interface SkillCategory {
  category: string;
  accent: "teal" | "mustard" | "orange" | "wine";
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
      { name: "Tailwind CSS", color: "teal" },
    ],
  },
  {
    category: "Backend",
    accent: "mustard",
    skills: [
      { name: "Python", color: "wine" },
      { name: "Supabase", color: "teal" },
      { name: "WordPress", color: "orange" },
    ],
  },
  {
    category: "Developer Tools",
    accent: "orange",
    skills: [
      { name: "GitHub", color: "mustard" },
      { name: "Vercel", color: "mustard" },
      { name: "Canva", color: "orange" },
    ],
  },
  {
    category: "AIs",
    accent: "teal",
    skills: [
      { name: "Claude", color: "teal" },
      { name: "ChatGPT", color: "mustard" },
      { name: "Gemini", color: "wine" },
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
}

export const certifications: Certification[] = [
  { title: "Certification Title One", issuer: "Issuer Name", year: "2026", category: "Web Dev", url: "" },
  { title: "Certification Title Two", issuer: "Issuer Name", year: "2025", category: "Design", url: "" },
  { title: "Certification Title Three", issuer: "Issuer Name", year: "2025", category: "AI", url: "" },
  { title: "Certification Title Four", issuer: "Issuer Name", year: "2024", category: "Tools", url: "" }
];

export const contact = {
  email: "deghneagana@gmail.com",
  github: "https://github.com/DeghneG",
  phone: [
    { label: "Globe", number: "0977 024 8366" },
    { label: "Smart", number: "0961 776 8196" },
  ],
} as const;

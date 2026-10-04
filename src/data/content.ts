/**
 * All portfolio content lives here.
 * Edit this file to update your site — no digging through components.
 */

export const siteConfig = {
  name: "Deghne Gabriel Agana",
  handle: "gabz.io",
  role: "Front-end Developer",
  introLine:
    "I build interfaces that feel alive, look intentional, and respect the people using them.",
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
    liveUrl: "#",
    repoUrl: "#",
    image: "/projects/itsa.png",
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
    ],
  },
  {
    category: "CMS",
    accent: "wine",
    skills: [
      { name: "WordPress", color: "wine" },
    ],
  },
  {
    category: "Developer Tools",
    accent: "wine",
    skills: [
      { name: "GitHub", color: "mustard" },
      { name: "Vercel", color: "mustard" },
      { name: "Canva", color: "orange" },
    ],
  },
  {
    category: "AIs",
    accent: "orange",
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

export const contact = {
  email: "deghneagana@gmail.com",
  github: "https://github.com/DeghneG",
  phone: [
    { label: "Globe", number: "0977 024 8366" },
    { label: "Smart", number: "0961 776 8196" },
  ],
} as const;

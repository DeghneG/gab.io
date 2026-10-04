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
  title: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    title: "ITSA Website",
    description:
      "ITSA is the official academic association for IT students at the University of San Agustin. We exist to build community, skills, and opportunities in tech — turning coursework into practice, and students into professionals.",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "#",
    repoUrl: "#",
    image: "/images/project-itsa.jpg",
  },
];

export interface Skill {
  name: string;
  /** Accent color token name from the palette */
  color: "teal" | "mustard" | "orange" | "wine";
}

export const skills: Skill[] = [
  { name: "React", color: "teal" },
  { name: "Next.js", color: "mustard" },
  { name: "TypeScript", color: "orange" },
  { name: "Tailwind CSS", color: "teal" },
  { name: "Python", color: "wine" },
  { name: "GitHub", color: "mustard" },
  { name: "Canva", color: "orange" },
  { name: "Supabase", color: "teal" },
  { name: "WordPress", color: "wine" },
  { name: "Vercel", color: "mustard" },
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

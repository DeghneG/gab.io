import Hero from "@/components/sections/Hero";
import ContributionGraph from "@/components/ContributionGraph";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Setup from "@/components/sections/Setup";
import RibbonCableBridge from "@/components/RibbonCableBridge";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Skills />
      <Experience />
      <ContributionGraph />
      <RibbonCableBridge />
      <Setup />
      <Contact />
      <Footer />
    </main>
  );
}

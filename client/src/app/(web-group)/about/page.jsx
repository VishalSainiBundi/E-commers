import Hero from "@/Components/website/AHero";
import Stats from "@/Components/website/AStatus";
import AboutSplit from "@/Components/website//ASplit";
import Features from "@/Components/website/AFeature";
import Mission from "@/Components/website/AMission";
import Timeline from "@/Components/website/ATimeLine";
import TimelineSection from"@/Components/website/A-TSection";
import LeadershipSection from"@/Components/website/Leader";

export default function HomePage() {
  return (
    <main className="bg-gray-50">
      <Hero />
      <Stats />
      <AboutSplit />
      <Features />
      <Mission />
      <Timeline />
      <TimelineSection/>
      <LeadershipSection/>
    </main>
  );
}

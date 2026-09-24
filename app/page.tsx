import Hero from "@/components/Hero";
import UpcomingMeetings from "@/components/UpcomingMeetings";
import AboutSection from "@/components/AboutSection";
import MinistriesSection from "@/components/MinistriesSection";
import FirstVisitSection from "@/components/FirstVisitSection";
import MessagesSection from "@/components/MessagesSection";
import EventsSection from "@/components/EventsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <UpcomingMeetings />
      <AboutSection />
      <MinistriesSection />
      <FirstVisitSection />
      <MessagesSection />
      <EventsSection />
      <ContactSection />
    </main>
  );
}
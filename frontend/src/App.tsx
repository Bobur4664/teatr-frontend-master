import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import About from "@/pages/About";
import Repertoire from "@/pages/Repertoire";
import GallerySection from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Team from "@/pages/Team";
import PerformanceDetail from "@/pages/PerformanceDetail";
import ActorDetail from "@/pages/ActorDetail";
import Reels from "@/pages/Reels";
import InfoPage from "@/pages/InfoPage";
import ArchivePage from "@/pages/Archive";
import { ThemeProvider } from "@/context/ThemeContext";
import { SiteSettingsProvider, useSiteSettings } from "@/context/SiteSettingsContext";
import SiteNotFound from "@/pages/SiteNotFound";
import SiteHead from "@/components/SiteHead";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect, type ReactNode } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Renders the site, or the "no theater here" page when the subdomain
 *  resolved to nothing. Must live inside SiteSettingsProvider to read it. */
function SiteGate({ children }: { children: ReactNode }) {
  const { loading, notFound } = useSiteSettings();

  useEffect(() => {
    if (!loading) window.dispatchEvent(new Event("theatre:ready"));
  }, [loading]);

  // Deliberately NOT gated on `loading`. Blanking the page until the settings
  // request returns would cost every visitor on every site a blank first paint
  // on an API round-trip, to spare an unknown subdomain a brief flash of site
  // chrome before the not-found page replaces it. The error case is rarer, and
  // it is the one that can afford the flash.
  if (notFound) return <SiteNotFound />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SiteSettingsProvider>
        <SiteGate>
        <SiteHead />
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground">
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/repertoire" element={<Repertoire />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<GallerySection />} />
              <Route path="/performance/:id" element={<PerformanceDetail />} />
              <Route path="/actor/:id" element={<ActorDetail />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/rules" element={<InfoPage type="rules" />} />
              <Route path="/vacancies" element={<InfoPage type="vacancies" />} />
              <Route path="/press" element={<InfoPage type="press" />} />
              <Route path="/open-data" element={<InfoPage type="open_data" />} />
              <Route path="/privacy" element={<InfoPage type="privacy" />} />
              <Route path="/terms" element={<InfoPage type="terms" />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </SiteGate>
        </SiteSettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

import Header from "./components/Header";
import Hero from "./components/Hero";
import Expertise from "./components/Expertise";
import Pillars from "./components/Pillars";
import Safety from "./components/Safety";
import Leadership from "./components/Leadership";
import Dossier from "./components/Dossier";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

/**
 * Narrative spine of the site:
 * COMPANY → CAPABILITY → SERVICES → TRUST (SAFETY) → CREDIBILITY →
 * LEGAL DOSSIER → ACTION.
 */
export default function App() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Expertise />
        <Pillars />
        <Safety />
        <Leadership />
        <Dossier />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

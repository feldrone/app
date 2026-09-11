import Header from "./components/Header";
import Hero from "./components/Hero";
import Expertise from "./components/Expertise";
import Pillars from "./components/Pillars";
import Safety from "./components/Safety";
import Leadership from "./components/Leadership";
import LegalNotice from "./components/LegalNotice";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

/**
 * Narrative spine of the site:
 * COMPANY → CAPABILITY → SERVICES → TRUST (SAFETY) → LEADERSHIP → ACTION.
 * Legal identity data is isolated in the discreet mentions block that sits
 * outside the marketing narrative, reachable only from the footer.
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
        <Contact />
      </main>
      <LegalNotice />
      <Footer />
    </>
  );
}

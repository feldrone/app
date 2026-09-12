import Header from "./components/Header";
import Hero from "./components/Hero";
import Expertise from "./components/Expertise";
import Services from "./components/Services";
import Safety from "./components/Safety";
import Leadership from "./components/Leadership";
import LegalNotice from "./components/LegalNotice";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

/**
 * Narrative spine of the site:
 * COMPANY → CAPABILITY → SERVICES → TRUST (SAFETY) → LEADERSHIP → FAQ → ACTION.
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
        <Services />
        <Safety />
        <Leadership />
        <Faq />
        <Contact />
      </main>
      <LegalNotice />
      <Footer />
    </>
  );
}

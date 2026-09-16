import Header from "./components/Header";
import Hero from "./components/Hero";
import Expertise from "./components/Expertise";
import Services from "./components/Services";
import Method from "./components/Method";
import Demonstration from "./components/Demonstration";
import Equipment from "./components/Equipment";
import Safety from "./components/Safety";
import Leadership from "./components/Leadership";
import LegalNotice from "./components/LegalNotice";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

/**
 * V10 narrative spine:
 * COMPANY (Hero) → CAPABILITY (Expertise) → SERVICES (7 poles, 3 primary)
 * → METHOD (Huit étapes, zéro improvisation) → DEMONSTRATION (Orthophoto, MNT, NDVI, Rapport + Projets)
 * → EQUIPMENT (capacités vérifiées) → TRUST (Safety) → LEADERSHIP → FAQ → ACTION (Contact)
 * Legal isolated outside marketing flow.
 */
export default function App() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Expertise />
        <Services />
        <Method />
        <Demonstration />
        <Equipment />
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

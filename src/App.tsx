import Header from "./components/Header";
import Hero from "./components/Hero";
import Expertise from "./components/Expertise";
import Pillars from "./components/Pillars";
import Leadership from "./components/Leadership";
import Safety from "./components/Safety";
import Dossier from "./components/Dossier";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Expertise />
        <Pillars />
        <Leadership />
        <Safety />
        <Dossier />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import NewProject from "./pages/NewProject";
import Projects from "./pages/Projects";
import Container from "./layout/Container";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Project from "./pages/Project";

function App() {
  return (
    <Router>
      <Navbar />
      <Container customClass="min-height">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/newproject" element={<NewProject />} />
          {/* Corrigido: rota singular → /project/:id */}
          <Route path="/project/:id" element={<Project />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;

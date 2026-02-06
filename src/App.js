import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminCertificateManager from "./pages/AdminCertificateManager";
import CertificateVerification from "./pages/CertificateVerification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/certificates" element={<AdminCertificateManager />} />
        <Route path="/verify" element={<CertificateVerification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

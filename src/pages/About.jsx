import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="page">
        <h2>About IOSH Sri Lanka</h2>
        <p>
          The Institute of Occupational Safety and Health (IOSH) Sri Lanka
          provides professional services including safety training,
          environmental testing, and medical assessments to improve workplace safety.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default About;

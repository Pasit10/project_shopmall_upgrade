import FeaturedProducts from "../../Components/FeatureProducts";
import Footer from "../../Components/Footer";
import Hero from "../../Components/Hero";
import Navbar from "../../Components/Navbar";

function AdminHomePage() {

  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Footer />
    </>
  );
}

export default AdminHomePage;

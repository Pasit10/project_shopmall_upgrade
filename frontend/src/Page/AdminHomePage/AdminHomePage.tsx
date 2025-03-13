import FeaturedProducts from "../../Components/FeatureProducts";
import Footer from "../../Components/Footer";
import Hero from "../../Components/Hero";
import NavbarAdmin from "../../Components/NavbarAdmin";

function AdminHomePage() {
  return (
    <>
      <NavbarAdmin />
      <Hero />
      <FeaturedProducts />
      <Footer />
    </>
  );
}

export default AdminHomePage;

import { useEffect , useCallback }  from "react";
import FeaturedProducts from "../../Components/FeatureProducts";
import Footer from "../../Components/Footer";
import Hero from "../../Components/Hero";
import NavbarAdmin from "../../Components/NavbarAdmin";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";

function AdminHomePage() {
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
        const response = await axiosInstance.get("/user/me", { withCredentials: true });
        if (response.status === 200) {
            const { role } = response.data;
            if (role !== "admin" && role !== "superadmin") {
                navigate("/");
            }
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/");
    }
  }, [navigate]); // Added navigate as a dependency

  useEffect(() => {
      fetchUser();
  }, [fetchUser]);

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

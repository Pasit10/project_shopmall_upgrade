import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import axiosInstance from "../../utils/axios";
import ProductList from "../../Components/ProductList";
import CategoryFilter from "../../Components/CategoryFilter";
import Product from "../../Types/Product";
import { Category } from "../../Types/Category";

function ProductPage() {
  const [priceRange, setPriceRange] = useState<number>(1500);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [product, setProduct] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const isFetched = useRef(false);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/product/type", {
        withCredentials: true,
      });
      if (response.status === 200) setCategories(response.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axiosInstance.get("/product", {
        withCredentials: true,
      });
      if (response.status === 200) setProduct(response.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (!isFetched.current) {
      fetchProduct();
      fetchCategories();
      isFetched.current = true;
    }
  }, []);

  const filteredProducts = product.filter(
    (item) =>
      (selectedCategory === "all" ||
        Number(item.typeid) === Number(selectedCategory)) &&
      item.price_per_unit <= priceRange
  );

  return (
    <div className="product-page-wrapper">
      <Navbar />
      <div className="container-fluid">
        {filteredProducts.length > 0 ? (
          <div className="container py-5 my-5">
            <div className="row">
              {/* Sidebar */}
              <div className="col-lg-3">
                <div className="filter-section">
                  <h5 className="mb-3 d-flex align-items-center">
                    <Filter size={20} className="me-2" /> Filters
                  </h5>
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                  <div className="mb-4">
                    <h6>Price Range</h6>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="1500"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                    />
                    <div className="d-flex justify-content-between">
                      <span>$0</span>
                      <span>${priceRange}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9">
                <ProductList products={filteredProducts} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 my-5">
            <h4>No products available</h4>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProductPage;

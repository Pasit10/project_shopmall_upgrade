import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import axiosInstance from "../../utils/axios";
import ProductList from "../../Components/ProductList";
import CategoryFilter from "../../Components/CategoryFilter";
import Product from "../../Types/Product";
import { Category } from "../../Types/Category";

function ProductPage() {
  const [priceRange, setPriceRange] = useState<number>(50000);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [product, setProduct] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // อ่านค่าหมวดหมู่จาก URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");

  // ตั้งค่า `selectedCategory` ให้ตรงกับ URL และอัปเดตเมื่อ URL เปลี่ยน
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryFromURL || "all"
  );

  useEffect(() => {
    setSelectedCategory(categoryFromURL || "all");
  }, [categoryFromURL]); // เมื่อ URL เปลี่ยน ให้เปลี่ยนค่า selectedCategory

  // ดึงหมวดหมู่
  useEffect(() => {
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
    fetchCategories();
  }, []);

  // ดึงข้อมูลสินค้า
  useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await axiosInstance.get("/product", {
        withCredentials: true,
      });

      if (response.status === 200) {
        const fetchedProducts = response.data;
        setProduct(fetchedProducts);

        const realMaxPrice = fetchedProducts.reduce(
          (max: number, item: { price_per_unit: number; }) => (item.price_per_unit > max ? item.price_per_unit : max),
          0
        );
        setMaxPrice(realMaxPrice);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  fetchProduct();
}, []);


  // กรองสินค้าโดยดูจากหมวดหมู่และราคา
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
    <div className="container py-5 my-5">
      <div className="row">
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
                max={maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between">
                <span>$0</span>
                <span>${maxPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product List or No Products Message */}
        <div className="col-lg-9">
          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <div className="text-center py-5 my-5">
              <h4>No products available</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  <Footer />
</div>
  );
}

export default ProductPage;

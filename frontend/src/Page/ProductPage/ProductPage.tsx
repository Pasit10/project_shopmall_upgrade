import { Filter, Star } from "lucide-react";
import { useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  image: string;
  rating: number;
  colors: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Coffee Maker",
    price: 299.99,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=500",
    rating: 4.5,
    colors: ["#silver", "#black"],
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    price: 199.99,
    discount: 15,
    image:
      "https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80&w=500",
    rating: 4.8,
    colors: ["#white", "#black", "#blue"],
  },
  {
    id: 3,
    name: "Smart Watch Elite",
    price: 249.99,
    discount: 25,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=500",
    rating: 4.7,
    colors: ["#black", "#silver", "#gold"],
  },
  {
    id: 4,
    name: "Professional Camera Kit",
    price: 899.99,
    discount: 10,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500",
    rating: 4.9,
    colors: ["#black"],
  },
  {
    id: 5,
    name: "Gaming Laptop Pro",
    price: 1299.99,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=500",
    rating: 4.6,
    colors: ["#gray", "#black"],
  },
  {
    id: 6,
    name: "Fitness Tracker Plus",
    price: 79.99,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?auto=format&fit=crop&q=80&w=500",
    rating: 4.4,
    colors: ["#black", "#blue", "#pink"],
  },
];

function ProductPage() {
  const [priceRange, setPriceRange] = useState<number>(1500);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    "electronics",
    "accessories",
    "cameras",
    "computers",
    "audio",
  ];

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="container py-5 my-5">
          <div className="row">
            {/* Filters Sidebar */}
            <div className="col-lg-3">
              <div className="filter-section">
                <h5 className="mb-3 d-flex align-items-center">
                  <Filter size={20} className="me-2" />
                  Filters
                </h5>

                <div className="mb-4">
                  <h6>Categories</h6>
                  {categories.map((category) => (
                    <div className="form-check" key={category}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="category"
                        id={category}
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                      />
                      <label
                        className="form-check-label text-capitalize"
                        htmlFor={category}
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>

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

            {/* Products Grid */}
            <div className="col-lg-9">
              <div className="row g-4">
                {products.map((product) => (
                  <div key={product.id} className="col-md-4">
                    <div className="card product-card h-100">
                      <div className="badge-overlay">
                        <span className="badge bg-danger">
                          {product.discount}% OFF
                        </span>
                      </div>
                      <img
                        src={product.image}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <div className="mb-2">
                          <span className="text-warning me-1">
                            {[...Array(Math.floor(product.rating))].map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  fill="#ffc107"
                                  stroke="#ffc107"
                                />
                              )
                            )}
                          </span>
                          <small className="text-muted">
                            ({product.rating})
                          </small>
                        </div>
                        <div className="mb-2">
                          {product.colors.map((color, index) => (
                            <span
                              key={index}
                              className="color-circle"
                              style={{ backgroundColor: color }}
                              title={color.replace("#", "")}
                            />
                          ))}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="text-danger fw-bold">
                              $
                              {(
                                product.price *
                                (1 - product.discount / 100)
                              ).toFixed(2)}
                            </span>
                            <small className="text-muted text-decoration-line-through ms-2">
                              ${product.price}
                            </small>
                          </div>
                          <button className="btn btn-primary btn-sm">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
        <Footer />
    </>
  );
}

export default ProductPage;

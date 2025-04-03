import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import CartItem from "../Types/CartItem";
import Navbar from "./Navbar";

const CartList = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [localQuantities, setLocalQuantities] = useState<{ [key: number]: number }>({});

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get("/user/cart", { withCredentials: true });
      if (response.status === 200) {
        const updatedCart = response.data.map((item: CartItem) => ({
          ...item,
          is_select: item.is_select || "F", // กำหนดค่าเริ่มต้นเป็น "F"
        }));

        setCartItems(updatedCart);

        // เซ็ตค่า localQuantities ให้ตรงกับค่าจาก API
        const quantities = updatedCart.reduce((acc: { [key: number]: number }, item: CartItem) => {
          acc[item.product_id] = item.qty;
          return acc;
        }, {});
        setLocalQuantities(quantities);
      }
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleSelectItem = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId ? { ...item, is_select: item.is_select === "T" ? "F" : "T" } : item
      )
    );
  };

  const handleLocalQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLocalQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
  };

  const handleCheckout = async () => {
    const selectedItems = cartItems.filter((item) => item.is_select === "T");

    if (selectedItems.length === 0) {
      alert("Please select items to checkout.");
      return;
    }

    try {
      const itemsToUpdate = selectedItems.map((item) => ({
        id: item.product_id,
        qty: localQuantities[item.product_id] || 0,
        is_select: item.is_select
      }));

      await axiosInstance.put("/user/cart", { items: itemsToUpdate }, { withCredentials: true });

      const response = await axiosInstance.post(
        "/api/order/checkout",
        { items: selectedItems.map((item) => item.product_id) },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setCartItems((prevItems) => prevItems.filter((item) => item.is_select !== "T"));

        setLocalQuantities((prev) => {
          const updatedQuantities = { ...prev };
          selectedItems.forEach((item) => delete updatedQuantities[item.product_id]);
          return updatedQuantities;
        });

        alert("Checkout successful!");
      }
    } catch (error) {
      console.error("Error during checkout", error);
      alert("Checkout failed. Please try again.");
    }
  };

  const handleRemoveFromCart = async (productId: number) => {
    try {
      const response = await axiosInstance.delete(`/api/cart/remove/${productId}`, { withCredentials: true });
  
      if (response.status === 200) {
        // อัปเดต state โดยลบสินค้าที่ถูกลบออกจาก cartItems
        setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
  
        // ลบข้อมูลจำนวนสินค้าออกจาก localQuantities
        setLocalQuantities((prev) => {
          const updatedQuantities = { ...prev };
          delete updatedQuantities[productId];
          return updatedQuantities;
        });
  
        alert("Item removed successfully!");
      }
    } catch (error) {
      console.error("Error removing item from cart", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price_per_unit * item.qty, 0);
  const selectedTotalPrice = cartItems
    .filter((item) => item.is_select === "T")
    .reduce((total, item) => total + item.price_per_unit * item.qty, 0);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-2">Shopping Cart</h2>
        <p className="text-center text-muted mb-5">Review your selected products</p>

        {cartItems.map((item) => (
          <div key={item.product_id} className="col-12 mb-4">
            <div className="card border-0">
              <div className="row g-0">
                <div className="col-md-1 d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={item.is_select === "T"}
                    onChange={() => handleSelectItem(item.product_id)}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{item.product_name}</h5>
                    <p className="card-text">Price: ${item.price_per_unit}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleLocalQuantityChange(item.product_id, localQuantities[item.product_id] - 1)}
                        >
                          -
                        </button>
                        <span className="mx-2">{localQuantities[item.product_id]}</span>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleLocalQuantityChange(item.product_id, localQuantities[item.product_id] + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div>
                        <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item.product_id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="mt-3">Total: ${item.price_per_unit * localQuantities[item.product_id]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="text-end">
          <h4>Total: ${totalPrice}</h4>
          <h4>Selected Total: ${selectedTotalPrice}</h4>
          <button className="btn btn-success mt-2" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartList;

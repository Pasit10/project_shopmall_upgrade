import { useState, useEffect } from 'react';
import axiosInstance from "../utils/axios";
import CartItem from '../Types/CartItem';


const CartList = () => {
   // state สำหรับเก็บข้อมูลสินค้าในตะกร้า
   const [cartItems, setCartItems] = useState<CartItem[]>([]);

   // ฟังก์ชันดึงข้อมูลสินค้าจากตะกร้า
   const fetchCartItems = async () => {
    try {
      // ดึงข้อมูลสินค้าจาก API (รวมทั้ง `product_id`, `qty` และ `Product` object)
      const response = await axiosInstance.get("/user/cart", { withCredentials: true });
      if(response.status===200){
        setCartItems(response.data);
      }
  
      // หากข้อมูลสินค้าอยู่ใน cartData แล้ว, สามารถใช้ข้อมูลนี้ได้เลย
      // const products = cartData.map((item: { product_id: number, qty: number, product: Product }) => {
      //   return {
      //     product_id: item.product_id,
      //     quantity: item.qty,
      //     product_name: item.product.product_name,
      //     price_per_unit: item.product.price_per_unit,
      //   };
      // });
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };

  // ฟังก์ชันสำหรับเพิ่มหรือลดจำนวนสินค้า
  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // ตรวจสอบไม่ให้จำนวนสินค้าน้อยกว่า 1

    try {
      await axiosInstance.put(
        `/api/cart/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );

      // อัพเดตข้อมูลใน state หลังจากเปลี่ยนแปลงจำนวนสินค้า
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  // ฟังก์ชันสำหรับลบสินค้าออกจากตะกร้า
  const handleRemoveFromCart = async (productId: number) => {
    try {
      await axiosInstance.delete(`/api/cart/${productId}`, { withCredentials: true });

      // อัพเดต state หลังจากลบสินค้า
      setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  // เรียกใช้งาน fetchCartItems เมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    fetchCartItems();
  }, []);

  // คำนวณราคาทั้งหมดในตะกร้า
  const totalPrice = cartItems.reduce((total, item) => total + item.price_per_unit * item.qty, 0);

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-2">Shopping Cart</h2>
      <p className="text-center text-muted mb-5">Review your selected products</p>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="row">
          {cartItems.map((item) => (
            <div key={item.product_id} className="col-12 mb-4">
              <div className="card border-0">
                <div className="row g-0">
                  <div className="col-md-9">
                    <div className="card-body">
                      <h5 className="card-title">{item.product_name}</h5>
                      <p className="card-text">Price: ${item.price_per_unit}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleQuantityChange(item.product_id, item.qty - 1)}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.qty}</span>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleQuantityChange(item.product_id, item.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRemoveFromCart(item.product_id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="mt-3">
                        Total: ${item.price_per_unit * item.qty}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-end">
        <h4>Total: ${totalPrice}</h4>
        <button className="btn btn-success mt-4">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartList;

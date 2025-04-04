import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import CartItem from "../Types/CartItem";
import Navbar from "./Navbar";
import { AxiosError } from "axios";

const CartList = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // const [localQuantities, setLocalQuantities] = useState<{ [key: number]: number }>({});

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get("/user/cart", { withCredentials: true });
      if (response.status === 200) {
        setCartItems(response.data)
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
        item.id === productId ? { ...item, is_select: item.is_select === "T" ? "F" : "T" } : item
      )
    );
  };

  const handleCheckout = async () => {
    try {
      // const selectedItems = cartItems.filter((item) => item.is_select === "T");
      const response = await axiosInstance.put("/user/cart", {
        cart: cartItems
      },{withCredentials:true});
      if (response.status === 200){
        setCartItems((prevItems) =>
          prevItems.filter((item) =>
            item.is_select === 'F'
          )
        )
      }else if(response.status !== 200) {
        throw new Error();
      }
      const response2 = await axiosInstance.get("/user/crate_transaction", {
        withCredentials: true
      })

      if(response2.status !== 201) {
        throw new Error();
      }
    }catch (error: unknown) {
      if(error instanceof AxiosError){
        alert(error.response)
      }else {
        alert(error)
      }
    }
  };

  const handleRemoveFromCart = async (productId: number) => {
    try{
      const response = await axiosInstance.delete(`/user/cart/${productId}`, {
        withCredentials: true
      });
      if(response.status === 200){
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
      }
    }catch(error) {
      console.error(error)
      alert(error)
    }
  };

  const updateItemCart = (productId: number, newQty: number) => {
    const updatedCartItems = cartItems.map(item =>
      (item.id === productId && newQty >= 0 && newQty <= item.stock_qty_frontend) ? { ...item, qty: newQty } : item
    );
    setCartItems(updatedCartItems);
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
          <div key={item.id} className="col-12 mb-4">
            <div className="card border-0">
              <div className="row g-0">
                <div className="col-md-1 d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={item.is_select === "T"}
                    onChange={() => handleSelectItem(item.id)}
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
                          onClick={() => updateItemCart(item.id, item.qty - 1)}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.qty}</span>
                        <button
                          className="btn btn-secondary"
                          onClick={() => updateItemCart(item.id, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div>
                        <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="mt-3">Total: ${item.price_per_unit * item.qty}</p>
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

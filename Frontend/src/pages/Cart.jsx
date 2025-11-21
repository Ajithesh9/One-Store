import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <Link to="/" className="back-link-wrapper">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Link>

        <h1 className="cart-title">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p className="text-gray-400 text-lg">Your cart is empty.</p>
            <Link to="/#pricing" className="cart-empty-btn">
              Browse Plans
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-item-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div>
                    <h3 className="text-xl font-bold text-white" style={{ color: item.color }}>
                      {item.name} Plan
                    </h3>
                    <p className="text-gray-400 text-sm">{item.period} Billing</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-white">₹{item.price}</p>
                    <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-box">
              <div className="summary-card">
                <h3 className="summary-title">Order Summary</h3>
                <div className="total-row">
                  <span>Total</span>
                  <span className="text-[#03DAC6]">₹{total}</span>
                </div>
                <button onClick={() => navigate('/payment')} className="checkout-btn">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
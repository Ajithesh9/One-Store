import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutForm from '../components/CheckoutForm';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => {
    const { cartItems } = useCart();
    const { user } = useAuth();
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const totalAmount = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0);

    useEffect(() => {
        if (!user) navigate('/login');
        if (cartItems.length === 0) navigate('/cart');

        if (totalAmount > 0) {
            fetch("/api/payment/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({ amount: totalAmount }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`Server Error: ${text}`);
                    }
                    return res.json();
                })
                .then((data) => setClientSecret(data.clientSecret))
                .catch((err) => {
                    console.error("Payment Setup Error:", err);
                    setError(err.message);
                });
        }
    }, [cartItems, user, totalAmount, navigate]);

    const options = {
        clientSecret,
        theme: 'night',
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary: '#BB86FC',
                colorBackground: '#1E1E1E',
                colorText: '#ffffff',
            }
        }
    };

    return (
        <div className="payment-page">
            <div className="payment-wrapper">
                <h1 className="payment-title">Checkout</h1>

                <div className="payment-card">
                    <div className="payment-summary">
                        <p className="text-gray-400">Total to Pay</p>
                        <p className="text-3xl font-bold text-white">₹{totalAmount.toFixed(2)}</p>
                    </div>

                    {error && (
                        <div className="payment-error">
                            <strong>Error loading payment:</strong> {error}
                        </div>
                    )}

                    {clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm amount={totalAmount} />
                        </Elements>
                    )}

                    {!clientSecret && !error && (
                        <p className="payment-loading">Connecting to secure server...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;
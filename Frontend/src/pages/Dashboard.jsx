import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Package, Calendar, Download, Clock } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Protect Route & Fetch Data
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders/myorders', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`, // Send the token to prove who we are
                    },
                });
                const data = await res.json();

                if (res.ok) {
                    setOrders(data);
                } else {
                    console.error("Failed to fetch orders");
                }
            } catch (error) {
                console.error("Network error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0C0E12] pt-28 px-6 md:px-12 text-white font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-800 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=BB86FC&color=000`}
                            alt="Profile"
                            className="w-20 h-20 rounded-full border-4 border-[#1E1E1E] shadow-lg"
                        />
                        <div>
                            <h1 className="text-3xl font-bold text-white">Hello, {user.name}</h1>
                            <p className="text-gray-400">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="px-3 py-1 bg-[#1E1E1E] text-[#03DAC6] text-xs rounded-full border border-[#03DAC6]/20">
                                    {user.isAdmin ? 'Admin Access' : 'Premium Member'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="mt-4 md:mt-0 px-6 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition text-sm font-medium"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-2">
                            <Package className="text-[#BB86FC] w-5 h-5" />
                            <h3 className="text-gray-400 text-sm font-medium">Total Orders</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{loading ? "..." : orders.length}</p>
                    </div>

                    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="text-[#03DAC6] w-5 h-5" />
                            <h3 className="text-gray-400 text-sm font-medium">Member Since</h3>
                        </div>
                        <p className="text-xl font-medium text-white">
                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="text-[#60A5FA] w-5 h-5" />
                            <h3 className="text-gray-400 text-sm font-medium">Last Login</h3>
                        </div>
                        <p className="text-xl font-medium text-white">Just now</p>
                    </div>
                </div>

                {/* Order History Section */}
                <div className="bg-[#1E1E1E] rounded-xl border border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">Order History</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading your history...</div>
                    ) : orders.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <p className="mb-4">You haven't purchased any plans yet.</p>
                            <button
                                onClick={() => navigate('/#pricing')}
                                className="px-6 py-2 bg-[#BB86FC] text-black font-bold rounded hover:bg-[#9e6be0] transition"
                            >
                                View Pricing
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {orders.map((order) => (
                                <div key={order._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition">

                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[#03DAC6] font-bold text-lg">
                                                {order.orderItems[0].name} Plan
                                            </span>
                                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20">
                                                Paid
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            Order ID: <span className="font-mono text-gray-500">#{order._id.slice(-6)}</span> •
                                            Date: {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-left md:text-right">
                                        <p className="text-xl font-bold text-white">₹{order.totalPrice}</p>
                                        <p className="text-xs text-gray-500">Via {order.paymentMethod}</p>
                                    </div>

                                    {/* Action Button (Project Requirement: PDF Delivery) */}
                                    <div>
                                        <a
                                            // For the resume project, you can link to a dummy PDF or handle the logic
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert("Downloading your Secure Setup Guide (PDF)...");
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white text-sm font-medium rounded-lg border border-gray-700 transition"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Guide
                                        </a>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Package, Calendar, Download, Clock } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders/myorders', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
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

    // --- NEW LOGIC: Determine User Status ---
    const getUserStatus = () => {
        if (user?.isAdmin) return 'Admin Access';

        if (orders.length > 0) {
            // 1. Sort orders by date (newest first)
            // This ensures we show the current/latest plan if they bought multiple
            const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // 2. Get the plan name from the first item in the latest order
            // Example: "Gold" -> "Gold Plan"
            const latestPlanName = sortedOrders[0].orderItems[0]?.name;

            return latestPlanName ? `${latestPlanName} Plan` : 'Standard Member';
        }

        return 'Free Member';
    };

    if (!user) return null;

    return (
        <div className="dashboard-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="dashboard-container"
            >
                {/* Header Section */}
                <div className="dashboard-header">
                    <div className="user-profile">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=BB86FC&color=000`}
                            alt="Profile"
                            className="profile-img"
                        />
                        <div>
                            <h1 className="text-3xl font-bold text-white">Hello, {user.name}</h1>
                            <p className="text-gray-400">{user.email}</p>
                            <div className="user-badge">
                                {/* Display dynamic status here */}
                                {getUserStatus()}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="logout-button"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">
                            <Package className="text-[#BB86FC] w-5 h-5" />
                            <h3>Total Orders</h3>
                        </div>
                        <p className="stat-value">{loading ? "..." : orders.length}</p>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">
                            <Calendar className="text-[#03DAC6] w-5 h-5" />
                            <h3>Member Since</h3>
                        </div>
                        <p className="text-xl font-medium text-white">
                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">
                            <Clock className="text-[#60A5FA] w-5 h-5" />
                            <h3>Last Login</h3>
                        </div>
                        <p className="text-xl font-medium text-white">Just now</p>
                    </div>
                </div>

                {/* Order History Section */}
                <div className="history-container">
                    <div className="history-header">
                        <h2 className="text-xl font-semibold text-white">Order History</h2>
                    </div>

                    {loading ? (
                        <div className="empty-state">Loading your history...</div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state">
                            <p className="mb-4">You haven't purchased any plans yet.</p>
                            <button
                                onClick={() => navigate('/#pricing')}
                                className="empty-button"
                            >
                                View Pricing
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {orders.map((order) => (
                                <div key={order._id} className="order-item">

                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[#03DAC6] font-bold text-lg">
                                                {order.orderItems[0].name} Plan
                                            </span>
                                            <span className="order-badge">
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

                                    {/* Action Button */}
                                    <div>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert("Downloading your Secure Setup Guide (PDF)...");
                                            }}
                                            className="download-button"
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
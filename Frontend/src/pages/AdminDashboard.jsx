import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Security Check
        if (!user || !user.isAdmin) {
            navigate('/dashboard'); // Kick non-admins back to user dashboard
            return;
        }

        // 2. Fetch All Data
        const fetchAllOrders = async () => {
            try {
                const res = await fetch('/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setOrders(data);
                }
            } catch (error) {
                console.error("Admin Load Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllOrders();
    }, [user, navigate]);

    // Calculate Stats
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = orders.length;
    // Mock calculation for "Active Users" (unique users who bought something)
    const uniqueCustomers = new Set(orders.map(o => o.user?._id)).size;

    if (loading) return <div className="min-h-screen bg-[#0C0E12] flex items-center justify-center text-white">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-[#0C0E12] pt-28 px-6 md:px-12 text-white font-sans">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
                        <p className="text-gray-400">Welcome back, Boss.</p>
                    </div>
                    <button onClick={logout} className="px-4 py-2 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10">
                        Logout
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Total Revenue"
                        value={`₹${totalRevenue.toFixed(2)}`}
                        icon={DollarSign}
                        color="text-[#03DAC6]"
                        bg="bg-[#03DAC6]/10"
                    />
                    <StatCard
                        title="Total Orders"
                        value={totalOrders}
                        icon={ShoppingBag}
                        color="text-[#BB86FC]"
                        bg="bg-[#BB86FC]/10"
                    />
                    <StatCard
                        title="Customers"
                        value={uniqueCustomers}
                        icon={Users}
                        color="text-[#60A5FA]"
                        bg="bg-[#60A5FA]/10"
                    />
                    <StatCard
                        title="Growth"
                        value="+12.5%"
                        icon={TrendingUp}
                        color="text-green-400"
                        bg="bg-green-400/10"
                    />
                </div>

                {/* Recent Orders Table */}
                <div className="bg-[#1E1E1E] rounded-xl border border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-semibold">Recent Transactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#252525] text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4 font-mono text-sm text-gray-500">#{order._id.slice(-6)}</td>
                                        <td className="px-6 py-4 font-medium">{order.user?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-white">₹{order.totalPrice}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/20">
                                                Paid
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bg}`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;
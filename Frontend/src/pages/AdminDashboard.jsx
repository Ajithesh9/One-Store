import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/dashboard');
            return;
        }

        const fetchAllOrders = async () => {
            try {
                const res = await fetch('/api/orders', {
                    headers: { 'Authorization': `Bearer ${user.token}` },
                });
                const data = await res.json();
                if (res.ok) setOrders(data);
            } catch (error) {
                console.error("Admin Load Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, [user, navigate]);

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(o => o.user?._id)).size;

    if (loading) return <div className="min-h-screen bg-[#0C0E12] flex items-center justify-center text-white">Loading Admin Panel...</div>;

    return (
        <div className="admin-page">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="admin-container"
            >
                <div className="admin-header">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
                        <p className="text-gray-400">Welcome back, Boss.</p>
                    </div>
                    <button onClick={logout} className="admin-logout">Logout</button>
                </div>

                <div className="admin-stats-grid">
                    <StatCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} icon={DollarSign} color="text-[#03DAC6]" bg="bg-[#03DAC6]/10" />
                    <StatCard title="Total Orders" value={totalOrders} icon={ShoppingBag} color="text-[#BB86FC]" bg="bg-[#BB86FC]/10" />
                    <StatCard title="Customers" value={uniqueCustomers} icon={Users} color="text-[#60A5FA]" bg="bg-[#60A5FA]/10" />
                    <StatCard title="Growth" value="+12.5%" icon={TrendingUp} color="text-green-400" bg="bg-green-400/10" />
                </div>

                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h2 className="text-xl font-semibold">Recent Transactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead className="admin-thead">
                                <tr>
                                    <th className="admin-th">Order ID</th>
                                    <th className="admin-th">Customer</th>
                                    <th className="admin-th">Date</th>
                                    <th className="admin-th">Amount</th>
                                    <th className="admin-th">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {orders.map((order) => (
                                    <tr key={order._id} className="admin-row">
                                        <td className="admin-td font-mono text-sm text-gray-500">#{order._id.slice(-6)}</td>
                                        <td className="admin-td font-medium">{order.user?.name || 'Unknown'}</td>
                                        <td className="admin-td text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="admin-td text-white">₹{order.totalPrice}</td>
                                        <td className="admin-td">
                                            <span className="admin-status-paid">Paid</span>
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
    <div className="admin-stat-card">
        <div className={`admin-stat-icon-wrapper ${bg}`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;
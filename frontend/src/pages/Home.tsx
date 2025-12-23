import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import {
    Plus,
    Activity,
    AlertCircle,
    Settings,
    CreditCard,
    AlertTriangle,
    Shield,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AgentDashboard from '../components/AgentDashboard';

function Home() {
    const { user } = useSelector((state: RootState) => state.auth);

    if (user && (user.role === 'agent' || user.role === 'admin')) {
        return <AgentDashboard />;
    }

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-[rgb(30,30,35)] py-24 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40 bg-cover bg-center"
                    style={{ backgroundImage: "url('/home-bg.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/70" />

                <div className="relative container mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        How can we <span className="text-blue-500">help you</span> today?
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Welcome back, {user?.name || 'Valued Customer'}. Our dedicated support team is ready to resolve your technical issues and answer your product questions.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                        <Link
                            to="/new-ticket"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition shadow-lg flex items-center justify-center gap-2"
                        >
                            <Plus size={20} /> Create New Ticket
                        </Link>
                        <Link
                            to="/tickets"
                            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-8 py-4 rounded-lg font-bold text-lg transition border border-white/20 flex items-center justify-center gap-2"
                        >
                            <Activity size={20} /> View My Tickets
                        </Link>
                    </div>

                    {/* System Status Banner - Integrated into Hero */}
                    <div className="flex justify-center">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2.5 rounded-full flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-sm font-semibold text-gray-200">System Status: <span className="text-green-400">Operational</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 mt-12 pb-24">

                {/* How it Works Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-md transition group">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <Plus size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Describe the Issue</h3>
                        <p className="text-gray-600 mb-4">Provide clear details and attach relevant logs to help our team understand the situation quickly.</p>
                        <Link to="/new-ticket" className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm">Get Started <ArrowRight size={16} /></Link>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-md transition group">
                        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <AlertCircle size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Priority Queuing</h3>
                        <p className="text-gray-600 mb-4">Our intelligent system routes your request based on severity to ensure critical issues get immediate attention.</p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-md transition group">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <Activity size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                        <p className="text-gray-600 mb-4">Monitor your ticket's status in real-time and communicate directly with assigned support staff.</p>
                        <Link to="/tickets" className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm">Dashboard <ArrowRight size={16} /></Link>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Recent Support Tickets</h2>
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ticket ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Subject</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Last Update</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50 transition cursor-pointer">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#TK-88210</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">Macbook Pro Battery Drain Issue</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">IN PROGRESS</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 italic">2 hours ago</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition cursor-pointer">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#TK-88195</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">iCloud Synchronization Error</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">OPEN</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 italic">Yesterday</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition cursor-pointer">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#TK-88142</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">iPhone 15 Display Flickering</td>
                                    <td className="px-6 py-4 text-xs font-bold">
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">CLOSED</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 italic">Oct 24, 2023</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Knowledge Base */}
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Search the Knowledge Base</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-blue-200 transition cursor-pointer group">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">Account Settings</h4>
                            <p className="text-gray-600 text-sm mb-3">Manage your profile, security preferences, and account recovery options.</p>
                            <span className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">View Articles <ArrowRight size={14} /></span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-blue-200 transition cursor-pointer group">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">Billing & Payments</h4>
                            <p className="text-gray-600 text-sm mb-3">Update payment methods, view invoices, and understand your subscriptions.</p>
                            <span className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">View Articles <ArrowRight size={14} /></span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-blue-200 transition cursor-pointer group">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-110 transition">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">Technical Errors</h4>
                            <p className="text-gray-600 text-sm mb-3">Troubleshooting guides for common hardware and software bugs.</p>
                            <span className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">View Articles <ArrowRight size={14} /></span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-blue-200 transition cursor-pointer group">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">Security & Privacy</h4>
                            <p className="text-gray-600 text-sm mb-3">Learn about data protection protocols and how to secure your data.</p>
                            <span className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">View Articles <ArrowRight size={14} /></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Overlay Example */}
            <div className="hidden fixed inset-0 bg-blue-600/10 backdrop-blur-[2px] z-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm border border-blue-100">
                    <CheckCircle2 className="text-blue-600 mx-auto mb-4" size={56} />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Ticket Created!</h3>
                    <p className="text-gray-500 mb-6">Our agents have been notified and will respond shortly.</p>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Done</button>
                </div>
            </div>
        </div>
    );
}

export default Home;

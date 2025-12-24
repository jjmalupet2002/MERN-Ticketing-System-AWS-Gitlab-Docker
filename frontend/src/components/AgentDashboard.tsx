import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllTickets, reset } from '../features/tickets/ticketSlice';
import type { Ticket } from '../features/tickets/ticketSlice';
import type { RootState, AppDispatch } from '../app/store';
import Spinner from './Spinner';
import {
    LayoutDashboard,
    Inbox,
    AlertCircle,
    Clock,
    Eye,
    BookOpen,
    ShieldCheck,
    BookCheck,
    ArrowRightCircle
} from 'lucide-react';

const AgentDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { tickets, isLoading } = useSelector((state: RootState) => state.ticket);
    const [assignedSort, setAssignedSort] = useState<'asc' | 'desc'>('desc');
    const [unassignedSort, setUnassignedSort] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        dispatch(getAllTickets());
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    // Metrics calculation
    const assignedTickets = tickets.filter((t: Ticket) => t.assignedTo?._id === user?._id && t.status !== 'closed');
    const unassignedQueue = tickets.filter((t: Ticket) => !t.assignedTo && t.status !== 'closed');
    const urgentTickets = tickets.filter((t: Ticket) => t.status !== 'closed' && (t.product === 'iPhone' || t.product === 'Macbook Pro'));

    // Sorted assigned tickets
    const sortedAssignedTickets = useMemo(() => {
        return [...assignedTickets].sort((a, b) => {
            const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            return assignedSort === 'asc' ? comparison : -comparison;
        });
    }, [assignedTickets, assignedSort]);

    // Sorted unassigned tickets
    const sortedUnassignedTickets = useMemo(() => {
        return [...unassignedQueue].sort((a, b) => {
            const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            return unassignedSort === 'asc' ? comparison : -comparison;
        });
    }, [unassignedQueue, unassignedSort]);

    // Early return AFTER all hooks
    if (isLoading) return <Spinner />;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section - Metrics Hub */}
            <div className="relative bg-[rgb(30,30,35)] py-20 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40 bg-cover bg-center"
                    style={{ backgroundImage: "url('/home-bg.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/70" />

                <div className="relative container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Agent Control Center</h1>
                            <p className="text-gray-300">Welcome back, {user?.name}. System status: <span className="text-green-400 font-semibold uppercase tracking-wider">Active</span></p>
                        </div>
                        <div className="flex gap-4">
                            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 backdrop-blur-sm">
                                <Clock size={18} /> Shift Log
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Metric Cards - Glassmorphism */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                    <Inbox size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-white">My Active Tickets</h3>
                            </div>
                            <p className="text-5xl font-bold text-white">{assignedTickets.length}</p>
                            <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest font-bold">Assigned to you</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                                    <LayoutDashboard size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Open Queue</h3>
                            </div>
                            <p className="text-5xl font-bold text-white">{unassignedQueue.length}</p>
                            <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest font-bold">Available to claim</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                                    <AlertCircle size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Overdue/Urgent</h3>
                            </div>
                            <p className="text-5xl font-bold text-white">{urgentTickets.length}</p>
                            <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest font-bold">Requires attention</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">

                {/* Priority Inbox */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-12">
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Inbox size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Assigned to Me</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={assignedSort}
                                onChange={(e) => setAssignedSort(e.target.value as 'asc' | 'desc')}
                                className="text-xs border border-gray-300 rounded px-3 py-1.5 font-semibold"
                            >
                                <option value="desc">Newest First</option>
                                <option value="asc">Oldest First</option>
                            </select>
                            <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                {assignedTickets.length} Active Tickets
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Ticket ID</th>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">Subject</th>
                                    <th className="px-8 py-5 text-center">Priority</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedAssignedTickets.slice(0, 5).map((ticket: Ticket) => (
                                    <tr key={ticket._id} className="hover:bg-gray-50/50 transition cursor-default">
                                        <td className="px-8 py-6 font-mono text-xs text-gray-400">#{ticket._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-8 py-6 text-xs text-gray-500">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6 text-gray-900 max-w-md">
                                            <div className="font-bold mb-0.5">{ticket.title}</div>
                                            <div className="text-xs text-gray-500 truncate">{ticket.description}</div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${ticket.product === 'iPhone' || ticket.product === 'Macbook Pro'
                                                ? 'bg-red-50 text-red-600 border border-red-100'
                                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                }`}>
                                                {ticket.product === 'iPhone' || ticket.product === 'Macbook Pro' ? 'High' : 'Normal'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="flex items-center gap-2 text-xs font-bold text-amber-600 italic">
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                to={`/ticket/${ticket._id}`}
                                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-800 transition shadow-sm"
                                            >
                                                Open <Eye size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {assignedTickets.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic font-medium">
                                            Your inbox is empty. Check the unassigned queue for new tasks.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Unassigned Queue */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-20">
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                <LayoutDashboard size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Unassigned Tickets</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={unassignedSort}
                                onChange={(e) => setUnassignedSort(e.target.value as 'asc' | 'desc')}
                                className="text-xs border border-gray-300 rounded px-3 py-1.5 font-semibold"
                            >
                                <option value="desc">Newest First</option>
                                <option value="asc">Oldest First</option>
                            </select>
                            <span className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                {unassignedQueue.length} Pending Claim
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Ticket ID</th>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">Subject</th>
                                    <th className="px-8 py-5">Product</th>
                                    <th className="px-8 py-5">Requester</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedUnassignedTickets.map((ticket: Ticket) => (
                                    <tr key={ticket._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-8 py-6 font-mono text-xs text-gray-400">#{ticket._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-8 py-6 text-xs text-gray-500">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6 font-bold text-gray-900">{ticket.title}</td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {ticket.product}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            <div className="font-bold text-gray-900">{ticket.user?.name}</div>
                                            <div className="text-xs text-gray-400 lowercase">{ticket.user?.email}</div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                to={`/ticket/${ticket._id}`}
                                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-800 transition shadow-sm"
                                            >
                                                View <Eye size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {unassignedQueue.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic font-medium">
                                            No unassigned tickets available. System clear!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Knowledge Base (Internal) */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-600">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Agent Resources</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl hover:bg-white hover:border-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition">
                            <BookCheck size={28} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Internal SOPs</h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">Verified procedures for account recovery and hardware troubleshooting.</p>
                        <span className="text-blue-600 text-sm font-black flex items-center gap-2 uppercase tracking-widest">Open <ArrowRightCircle size={16} /></span>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl hover:bg-white hover:border-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:bg-indigo-100 transition">
                            <Clock size={28} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Canned Text</h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">Templates for standard replies to improve resolution speed.</p>
                        <span className="text-blue-600 text-sm font-black flex items-center gap-2 uppercase tracking-widest">Browse <ArrowRightCircle size={16} /></span>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl hover:bg-white hover:border-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 group-hover:bg-amber-100 transition">
                            <LayoutDashboard size={28} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Tech Manuals</h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">Full technical specifications for iPhone and iMac lineups.</p>
                        <span className="text-blue-600 text-sm font-black flex items-center gap-2 uppercase tracking-widest">Read <ArrowRightCircle size={16} /></span>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl hover:bg-white hover:border-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 group-hover:bg-red-100 transition">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Escalations</h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">Contact info for Tier 3 engineers and department heads.</p>
                        <span className="text-blue-600 text-sm font-black flex items-center gap-2 uppercase tracking-widest">Connect <ArrowRightCircle size={16} /></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;

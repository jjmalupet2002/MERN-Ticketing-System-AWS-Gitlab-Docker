import { Link } from 'react-router-dom';
import { Plus, AlertCircle, Activity, Settings, CreditCard, AlertTriangle, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

function Home() {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className='home-page'>
            {/* Hero Section - Full Width */}
            <section
                className='hero-section relative flex flex-col items-center justify-center py-32 text-center text-white overflow-hidden min-h-[85vh]'
                style={{
                    backgroundImage: 'url(/home-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Dark overlay for readability */}
                <div className='absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/70 z-0'></div>

                <div className='relative z-10 container mx-auto px-4 max-w-4xl'>
                    <h1 className='text-6xl font-bold mb-6 drop-shadow-lg'>
                        Welcome back, {user ? user.name.split(' ')[0] : 'Guest'}!
                    </h1>
                    <p className='text-2xl text-gray-200 font-light mb-12 drop-shadow-md'>
                        Track, create, and manage your support tickets efficiently.
                    </p>
                    <div className='flex flex-col sm:flex-row justify-center gap-6'>
                        <Link to='/new-ticket' className='flex items-center justify-center px-10 py-5 bg-blue-600 text-white rounded-lg shadow-2xl hover:bg-blue-700 hover:scale-105 transition transform font-bold text-xl'>
                            <Plus className='mr-3' size={24} />
                            Create New Ticket
                        </Link>
                        <Link to='/tickets' className='flex items-center justify-center px-10 py-5 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 hover:scale-105 transition transform font-bold text-xl'>
                            <Activity className='mr-3' size={24} />
                            View My Tickets
                        </Link>
                    </div>
                </div>
            </section>

            {/* Content Area - White Background */}
            <div className='bg-white'>
                <div className='container mx-auto px-4 max-w-7xl'>

                    {/* System Status Indicator */}
                    <div className='py-8 flex justify-center'>
                        <div className='inline-flex items-center gap-3 px-6 py-3 bg-green-50 border border-green-200 rounded-full'>
                            <div className='relative'>
                                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                <div className='absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75'></div>
                            </div>
                            <span className='text-sm font-semibold text-green-800'>All systems operational</span>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <section className='py-16'>
                        <h2 className='text-4xl font-bold text-center mb-4 text-gray-900'>How It Works</h2>
                        <p className='text-center text-gray-600 mb-12 text-lg'>Get support in three simple steps</p>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                            {/* Step 1 */}
                            <div className='bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300'>
                                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6'>
                                    <Plus className='text-blue-600' size={32} />
                                </div>
                                <div className='text-sm font-bold text-blue-600 mb-2'>STEP 01</div>
                                <h3 className='text-2xl font-bold mb-4 text-gray-900'>Describe the Issue</h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    Click 'Create New Ticket' and provide specific details about your problem.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className='bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300'>
                                <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6'>
                                    <AlertCircle className='text-yellow-600' size={32} />
                                </div>
                                <div className='text-sm font-bold text-yellow-600 mb-2'>STEP 02</div>
                                <h3 className='text-2xl font-bold mb-4 text-gray-900'>Assign Priority</h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    Choose a priority level so we know the urgency of your request.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className='bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300'>
                                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6'>
                                    <Activity className='text-green-600' size={32} />
                                </div>
                                <div className='text-sm font-bold text-green-600 mb-2'>STEP 03</div>
                                <h3 className='text-2xl font-bold mb-4 text-gray-900'>Track Progress</h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    Check 'View My Tickets' for real-time updates on your support requests.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Recent Activity Feed */}
                    <section className='py-16'>
                        <h2 className='text-4xl font-bold mb-8 text-gray-900'>Your Recent Tickets</h2>

                        <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm'>
                            <div className='overflow-x-auto'>
                                <table className='w-full'>
                                    <thead className='bg-gray-50 border-b border-gray-200'>
                                        <tr>
                                            <th className='px-6 py-4 text-left text-sm font-bold text-gray-700'>Ticket ID</th>
                                            <th className='px-6 py-4 text-left text-sm font-bold text-gray-700'>Subject</th>
                                            <th className='px-6 py-4 text-left text-sm font-bold text-gray-700'>Status</th>
                                            <th className='px-6 py-4 text-left text-sm font-bold text-gray-700'>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-100'>
                                        <tr className='hover:bg-gray-50 transition-colors'>
                                            <td className='px-6 py-4 text-sm font-mono text-gray-600'>#TKT-1234</td>
                                            <td className='px-6 py-4 text-sm text-gray-900'>Login issues with mobile app</td>
                                            <td className='px-6 py-4'>
                                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800'>
                                                    Open
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 text-sm text-gray-600'>Dec 20, 2025</td>
                                        </tr>
                                        <tr className='hover:bg-gray-50 transition-colors'>
                                            <td className='px-6 py-4 text-sm font-mono text-gray-600'>#TKT-1233</td>
                                            <td className='px-6 py-4 text-sm text-gray-900'>Payment processing error</td>
                                            <td className='px-6 py-4'>
                                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800'>
                                                    In Progress
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 text-sm text-gray-600'>Dec 19, 2025</td>
                                        </tr>
                                        <tr className='hover:bg-gray-50 transition-colors'>
                                            <td className='px-6 py-4 text-sm font-mono text-gray-600'>#TKT-1232</td>
                                            <td className='px-6 py-4 text-sm text-gray-900'>Account verification needed</td>
                                            <td className='px-6 py-4'>
                                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800'>
                                                    Resolved
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 text-sm text-gray-600'>Dec 18, 2025</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
                                <Link to='/tickets' className='text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2'>
                                    View all tickets
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Knowledge Base Section */}
                    <section className='py-16 pb-24'>
                        <h2 className='text-4xl font-bold mb-4 text-gray-900'>Knowledge Base</h2>
                        <p className='text-gray-600 mb-12 text-lg'>Find answers to common questions</p>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Account Settings */}
                            <div className='bg-gray-50 border border-gray-200 rounded-xl p-8 hover:shadow-md transition-shadow'>
                                <div className='w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                                    <Settings className='text-blue-600' size={28} />
                                </div>
                                <h3 className='text-xl font-bold mb-3 text-gray-900'>Account Settings</h3>
                                <p className='text-gray-600 mb-4'>Manage your profile, preferences, and security settings.</p>
                                <a href='#' className='text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-2'>
                                    View Articles
                                    <span>→</span>
                                </a>
                            </div>

                            {/* Billing */}
                            <div className='bg-gray-50 border border-gray-200 rounded-xl p-8 hover:shadow-md transition-shadow'>
                                <div className='w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
                                    <CreditCard className='text-green-600' size={28} />
                                </div>
                                <h3 className='text-xl font-bold mb-3 text-gray-900'>Billing</h3>
                                <p className='text-gray-600 mb-4'>Payment methods, invoices, and subscription management.</p>
                                <a href='#' className='text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-2'>
                                    View Articles
                                    <span>→</span>
                                </a>
                            </div>

                            {/* Technical Errors */}
                            <div className='bg-gray-50 border border-gray-200 rounded-xl p-8 hover:shadow-md transition-shadow'>
                                <div className='w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4'>
                                    <AlertTriangle className='text-red-600' size={28} />
                                </div>
                                <h3 className='text-xl font-bold mb-3 text-gray-900'>Technical Errors</h3>
                                <p className='text-gray-600 mb-4'>Troubleshooting guides for common technical issues.</p>
                                <a href='#' className='text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-2'>
                                    View Articles
                                    <span>→</span>
                                </a>
                            </div>

                            {/* Security */}
                            <div className='bg-gray-50 border border-gray-200 rounded-xl p-8 hover:shadow-md transition-shadow'>
                                <div className='w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
                                    <Shield className='text-purple-600' size={28} />
                                </div>
                                <h3 className='text-xl font-bold mb-3 text-gray-900'>Security</h3>
                                <p className='text-gray-600 mb-4'>Best practices for keeping your account safe and secure.</p>
                                <a href='#' className='text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-2'>
                                    View Articles
                                    <span>→</span>
                                </a>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

export default Home;

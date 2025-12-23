import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { getTicket, closeTicket } from '../features/tickets/ticketSlice';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import type { RootState, AppDispatch } from '../app/store';

function Ticket() {
    const { ticket, isLoading, isError, message } = useSelector(
        (state: RootState) => state.ticket
    );

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { ticketId } = params;

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (ticketId) {
            dispatch(getTicket(ticketId));
        }
    }, [isError, message, ticketId, dispatch]);

    // Close ticket
    const onTicketClose = () => {
        if (ticketId) {
            dispatch(closeTicket(ticketId));
            toast.success('Ticket Closed');
            navigate('/tickets');
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return <h3>Something Went Wrong</h3>;
    }

    // Helper function to get status color classes
    const getStatusClasses = (status?: string) => {
        switch (status) {
            case 'closed':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'open':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <BackButton url='/tickets' />

            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm'>
                {/* Header Section */}
                <div className='p-8 border-b border-gray-200'>
                    <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4'>
                        <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                                <h1 className='text-2xl font-bold text-gray-900'>
                                    Ticket #{ticket?._id.slice(-8).toUpperCase()}
                                </h1>
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getStatusClasses(ticket?.status)}`}>
                                    {ticket?.status?.toUpperCase()}
                                </span>
                            </div>
                            <p className='text-sm text-gray-500'>
                                Submitted on {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleString('en-US', {
                                    dateStyle: 'long',
                                    timeStyle: 'short'
                                }) : ''}
                            </p>
                        </div>

                        {ticket?.status !== 'closed' && (
                            <button
                                onClick={onTicketClose}
                                className='bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-bold shadow-md whitespace-nowrap'
                            >
                                Close Ticket
                            </button>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className='p-8'>
                    <h2 className='text-lg font-bold text-gray-900 mb-6'>Ticket Details</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                        {/* Product */}
                        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <label className='block text-sm font-semibold text-gray-600 mb-2'>Product</label>
                            <p className='text-base font-medium text-gray-900'>{ticket?.product}</p>
                        </div>

                        {/* Priority - Placeholder for future implementation */}
                        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <label className='block text-sm font-semibold text-gray-600 mb-2'>Priority</label>
                            <p className='text-base font-medium text-gray-900'>
                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800'>
                                    Medium
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className='mb-6'>
                        <label className='block text-sm font-semibold text-gray-600 mb-2'>Title</label>
                        <p className='text-lg font-medium text-gray-900'>{ticket?.title}</p>
                    </div>

                    {/* Description Section */}
                    <div className='mb-8'>
                        <label className='block text-sm font-semibold text-gray-600 mb-3'>Description</label>
                        <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                            <p className='text-gray-800 leading-relaxed whitespace-pre-wrap'>
                                {ticket?.description}
                            </p>
                        </div>
                    </div>

                    {/* Notes Section - Future-Proofing */}
                    <div className='border-t border-gray-200 pt-8'>
                        <h2 className='text-lg font-bold text-gray-900 mb-4'>Notes & Updates</h2>

                        <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
                            <div className='text-gray-400 mb-4'>
                                <svg className='mx-auto h-12 w-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' />
                                </svg>
                            </div>
                            <p className='text-gray-500 font-medium mb-2'>No notes yet</p>
                            <p className='text-sm text-gray-400'>Updates and replies will appear here</p>
                        </div>

                        {/* Placeholder for future reply functionality */}
                        {ticket?.status !== 'closed' && (
                            <div className='mt-6'>
                                <label className='block text-sm font-semibold text-gray-600 mb-2'>Add a Reply</label>
                                <textarea
                                    className='w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                                    rows={4}
                                    placeholder='Type your message here... (Coming soon)'
                                    disabled
                                ></textarea>
                                <button
                                    className='mt-3 bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-semibold cursor-not-allowed'
                                    disabled
                                >
                                    Send Reply (Coming Soon)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ticket;

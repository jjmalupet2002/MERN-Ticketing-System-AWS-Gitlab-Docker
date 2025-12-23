import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { getTicket, closeTicket, addNote } from '../features/tickets/ticketSlice';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import type { RootState, AppDispatch } from '../app/store';

function Ticket() {
    const { user } = useSelector((state: RootState) => state.auth);
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

    // Determine back URL based on role
    const backUrl = user?.role === 'agent' || user?.role === 'admin' ? '/' : '/tickets';

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
            <BackButton url={backUrl} />

            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm'>
                {/* Header Section */}
                <div className='p-8 border-b border-gray-200'>
                    <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4'>
                        <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2 flex-wrap'>
                                <h1 className='text-2xl font-bold text-gray-900'>
                                    Ticket #{ticket?._id.slice(-8).toUpperCase()}
                                </h1>
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getStatusClasses(ticket?.status)}`}>
                                    {ticket?.status?.toUpperCase()}
                                </span>
                                {ticket?.tags && ticket.tags.length > 0 && (
                                    <div className='flex gap-2 flex-wrap'>
                                        {ticket.tags.map((tag: string, index: number) => (
                                            <span
                                                key={index}
                                                className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200'
                                            >
                                                🏷️ {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
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
                    <h2 className='text-lg font-bold text-gray-900 mb-6'>Ticket Information</h2>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                        {/* Product */}
                        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>Product</label>
                            <p className='text-base font-semibold text-gray-900'>{ticket?.product}</p>
                        </div>

                        {/* Assigned Agent */}
                        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>Assigned Agent</label>
                            <p className='text-base font-semibold text-gray-900'>
                                {ticket?.assignedTo ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        {ticket.assignedTo.name}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 italic">Unassigned</span>
                                )}
                            </p>
                        </div>

                        {/* Status */}
                        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>Category</label>
                            <p className='text-base font-semibold text-gray-900'>
                                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600'>
                                    Technical Support
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className='mb-6'>
                        <label className='block text-sm font-semibold text-gray-600 mb-2'>Title</label>
                        <p className='text-lg font-medium text-gray-900'>{ticket?.title}</p>
                    </div>

                    {/* Attachments Section */}
                    {ticket?.attachments && ticket.attachments.length > 0 && (
                        <div className='mb-6'>
                            <label className='block text-sm font-semibold text-gray-600 mb-3'>Attachments</label>
                            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    {ticket.attachments.map((attachment: any, index: number) => {
                                        const fileExt = attachment.originalName.split('.').pop()?.toLowerCase();
                                        const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '');

                                        return (
                                            <a
                                                key={index}
                                                href={`http://localhost:5000/uploads/${attachment.filename}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition group'
                                            >
                                                <div className='flex-shrink-0'>
                                                    {isImage ? (
                                                        <span className='text-2xl'>🖼️</span>
                                                    ) : fileExt === 'pdf' ? (
                                                        <span className='text-2xl'>📄</span>
                                                    ) : fileExt === 'docx' ? (
                                                        <span className='text-2xl'>📝</span>
                                                    ) : (
                                                        <span className='text-2xl'>📎</span>
                                                    )}
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <p className='text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600'>
                                                        {attachment.originalName}
                                                    </p>
                                                    <p className='text-xs text-gray-500'>
                                                        Uploaded {new Date(attachment.uploadedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className='flex-shrink-0'>
                                                    <span className='text-blue-600 group-hover:text-blue-700'>↗</span>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description Section */}
                    <div className='mb-8'>
                        <label className='block text-sm font-semibold text-gray-600 mb-3'>Description</label>
                        <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                            <p className='text-gray-800 leading-relaxed whitespace-pre-wrap'>
                                {ticket?.description}
                            </p>
                        </div>
                    </div>

                    {/* Notes Section - Chat Thread */}
                    <div className='border-t border-gray-200 pt-8'>
                        <h2 className='text-lg font-bold text-gray-900 mb-6'>Conversation</h2>

                        {/* Notes Thread */}
                        <div className='space-y-4 mb-6'>
                            {ticket?.notes && ticket.notes.length > 0 ? (
                                ticket.notes.map((note, index) => {
                                    const isAgent = note.role === 'agent' || note.role === 'admin';
                                    return (
                                        <div
                                            key={index}
                                            className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-[75%] ${isAgent ? 'bg-blue-50 border-blue-200' : 'bg-gray-100 border-gray-200'} border rounded-lg p-4`}>
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${isAgent ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
                                                        }`}>
                                                        {isAgent ? '🛡️ Agent' : '👤 You'}
                                                    </span>
                                                    <span className='text-xs font-semibold text-gray-700'>
                                                        {note.author?.name || 'Unknown'}
                                                    </span>
                                                    <span className='text-xs text-gray-500'>
                                                        {new Date(note.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className='text-gray-800 leading-relaxed whitespace-pre-wrap'>
                                                    {note.content}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
                                    <div className='text-gray-400 mb-4'>
                                        <svg className='mx-auto h-12 w-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' />
                                        </svg>
                                    </div>
                                    <p className='text-gray-500 font-medium mb-2'>No messages yet</p>
                                    <p className='text-sm text-gray-400'>Start the conversation by adding a reply below</p>
                                </div>
                            )}
                        </div>

                        {/* Add Reply Form */}
                        {ticket?.status !== 'closed' && (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const formData = new FormData(form);
                                const content = formData.get('content') as string;
                                if (content.trim() && ticketId) {
                                    dispatch(addNote({ ticketId, content }))
                                        .unwrap()
                                        .then(() => {
                                            dispatch(getTicket(ticketId));
                                            form.reset();
                                        })
                                        .catch((error) => {
                                            toast.error(error || 'Failed to add note');
                                        });
                                }
                            }}>
                                <label className='block text-sm font-semibold text-gray-600 mb-2'>Add a Reply</label>
                                <textarea
                                    name='content'
                                    className='w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                                    rows={4}
                                    placeholder='Type your message here...'
                                    required
                                ></textarea>
                                <button
                                    type='submit'
                                    className='mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md'
                                >
                                    Send Reply
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ticket;

import { Link } from 'react-router-dom';

// Basic structure for local usage

function TicketItem({ ticket }: any) {
    return (
        <div className='ticket grid grid-cols-5 gap-4 p-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition items-center'>
            <div className='font-mono text-xs text-gray-400'>#{ticket._id.slice(-6).toUpperCase()}</div>
            <div className='text-sm text-gray-600'>{new Date(ticket.createdAt).toLocaleDateString()}</div>
            <div className='font-semibold text-gray-900'>
                <div className='flex items-center gap-2 flex-wrap'>
                    <span>{ticket.product}</span>
                    {ticket.tags && ticket.tags.length > 0 && (
                        <div className='flex gap-1 flex-wrap'>
                            {ticket.tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className='inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200'
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className='text-sm font-medium'>
                {ticket.assignedTo ? (
                    <span className="text-gray-900 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {ticket.assignedTo.name}
                    </span>
                ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                )}
            </div>
            <div className='flex items-center justify-between'>
                <div className={`status px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${ticket.status === 'closed' ? 'bg-red-50 text-red-600 border-red-100' :
                    ticket.status === 'open' ? 'bg-green-50 text-green-800 border-green-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                    {ticket.status}
                </div>
                <Link to={`/ticket/${ticket._id}`} className='text-blue-600 hover:text-blue-700 font-bold text-sm'>
                    View
                </Link>
            </div>
        </div>
    );
}

export default TicketItem;

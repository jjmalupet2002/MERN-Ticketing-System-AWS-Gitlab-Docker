import { Link } from 'react-router-dom';

// Assuming a basic structure for now, ideally imported from a types file or slice
interface Ticket {
    _id: string;
    createdAt: string;
    product: string;
    status: string;
}

interface TicketItemProps {
    ticket: Ticket;
}

function TicketItem({ ticket }: TicketItemProps) {
    return (
        <div className='ticket grid grid-cols-4 gap-4 p-3 border-b border-gray-200 bg-gray-50 mb-2 rounded items-center'>
            <div>{new Date(ticket.createdAt).toLocaleString('en-US')}</div>
            <div>{ticket.product}</div>
            <div className={`status status-${ticket.status} px-2 py-1 rounded text-xs font-bold inline-block w-fit ${ticket.status === 'closed' ? 'bg-red-200 text-red-800' :
                ticket.status === 'open' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                }`}>
                {ticket.status}
            </div>
            <Link to={`/ticket/${ticket._id}`} className='btn btn-reverse btn-sm border border-black px-2 py-1 rounded hover:bg-black hover:text-white transition justify-self-start'>
                View
            </Link>
        </div>
    );
}

export default TicketItem;

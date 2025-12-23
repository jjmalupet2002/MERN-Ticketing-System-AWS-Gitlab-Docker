import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTickets, reset } from '../features/tickets/ticketSlice';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import TicketItem from '../components/TicketItem';
import type { RootState, AppDispatch } from '../app/store';

function Tickets() {
    const { tickets, isLoading, isSuccess } = useSelector(
        (state: RootState) => state.ticket
    );

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        return () => {
            if (isSuccess) {
                dispatch(reset());
            }
        };
    }, [dispatch, isSuccess]);

    useEffect(() => {
        dispatch(getTickets());
    }, [dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <BackButton url='/' />
            <h1 className='text-3xl font-bold mb-5'>Tickets</h1>
            <div className='tickets border rounded-lg overflow-hidden border-gray-200'>
                <div className='ticket-headings grid grid-cols-5 gap-4 p-4 bg-gray-50 font-bold border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500'>
                    <div>Ticket ID</div>
                    <div>Date</div>
                    <div>Product</div>
                    <div>Assigned To</div>
                    <div>Status</div>
                </div>
                {tickets.map((ticket) => (
                    <TicketItem key={ticket._id} ticket={ticket} />
                ))}
            </div>
        </div>
    );
}

export default Tickets;

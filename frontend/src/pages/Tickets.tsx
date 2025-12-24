import { useEffect, useState, useMemo } from 'react';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'product' | 'status'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'open' | 'closed'>('all');

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

    // Filter and sort tickets
    const filteredAndSortedTickets = useMemo(() => {
        let result = [...tickets];

        // Filter by search term (title)
        if (searchTerm) {
            result = result.filter(ticket =>
                ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            result = result.filter(ticket => ticket.status === statusFilter);
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case 'product':
                    comparison = a.product.localeCompare(b.product);
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [tickets, searchTerm, sortBy, sortOrder, statusFilter]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <BackButton url='/' />
            <h1 className='text-3xl font-bold mb-5'>Tickets</h1>

            {/* Filters and Search */}
            <div className='bg-white border border-gray-200 rounded-lg p-4 mb-4'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                    {/* Search */}
                    <div>
                        <label className='block text-xs font-bold text-gray-600 mb-2'>Search by Title</label>
                        <input
                            type='text'
                            placeholder='Search tickets...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                        />
                    </div>

                    {/* Sort By */}
                    <div>
                        <label className='block text-xs font-bold text-gray-600 mb-2'>Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'date' | 'product' | 'status')}
                            className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                        >
                            <option value='date'>Date</option>
                            <option value='product'>Product</option>
                            <option value='status'>Status</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                        <label className='block text-xs font-bold text-gray-600 mb-2'>Order</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                            className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                        >
                            <option value='desc'>Descending</option>
                            <option value='asc'>Ascending</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className='block text-xs font-bold text-gray-600 mb-2'>Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'new' | 'open' | 'closed')}
                            className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                        >
                            <option value='all'>All Status</option>
                            <option value='new'>New</option>
                            <option value='open'>Open</option>
                            <option value='closed'>Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <p className='text-sm text-gray-600 mb-3'>
                Showing {filteredAndSortedTickets.length} of {tickets.length} tickets
            </p>

            <div className='tickets border rounded-lg overflow-hidden border-gray-200'>
                <div className='ticket-headings grid grid-cols-5 gap-4 p-4 bg-gray-50 font-bold border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500'>
                    <div>Ticket ID</div>
                    <div>Date</div>
                    <div>Product</div>
                    <div>Assigned To</div>
                    <div>Status</div>
                </div>
                {filteredAndSortedTickets.length > 0 ? (
                    filteredAndSortedTickets.map((ticket) => (
                        <TicketItem key={ticket._id} ticket={ticket} />
                    ))
                ) : (
                    <div className='p-8 text-center text-gray-500'>
                        <p className='font-medium'>No tickets found</p>
                        <p className='text-sm'>Try adjusting your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tickets;

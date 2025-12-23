import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createTicket, reset } from '../features/tickets/ticketSlice';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import type { RootState, AppDispatch } from '../app/store';

function NewTicket() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { isLoading, isError, isSuccess, message } = useSelector(
        (state: RootState) => state.ticket
    );

    const [name] = useState(user?.name);
    const [email] = useState(user?.email);
    const [product, setProduct] = useState('iPhone');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess) {
            dispatch(reset());
            navigate('/tickets');
        }

        dispatch(reset());
    }, [dispatch, isError, isSuccess, navigate, message]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(createTicket({ product, description, title }));
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <BackButton url='/' />
            <section className='heading text-center mb-8'>
                <h1 className='text-3xl font-bold'>Create New Ticket</h1>
                <p className='text-gray-600 font-bold'>Please fill out the form below</p>
            </section>

            <div className='max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8'>
                <div className='form-group mb-6'>
                    <label htmlFor='name' className='block font-bold mb-2 text-gray-700'>Customer Name</label>
                    <input type='text' className='form-control w-full p-3 border border-gray-300 rounded bg-gray-50' value={name} disabled />
                </div>
                <div className='form-group mb-6'>
                    <label htmlFor='email' className='block font-bold mb-2 text-gray-700'>Customer Email</label>
                    <input type='text' className='form-control w-full p-3 border border-gray-300 rounded bg-gray-50' value={email} disabled />
                </div>

                <hr className='my-6 border-gray-200' />

                <form onSubmit={onSubmit}>
                    <div className='form-group mb-6'>
                        <label htmlFor='title' className='block font-bold mb-2 text-gray-700'>Title</label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            className='form-control w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='Brief description of your issue'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className='form-group mb-6'>
                        <label htmlFor='product' className='block font-bold mb-2 text-gray-700'>Product</label>
                        <select
                            name='product'
                            id='product'
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            className='form-control w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value='iPhone'>iPhone</option>
                            <option value='Macbook Pro'>Macbook Pro</option>
                            <option value='iMac'>iMac</option>
                            <option value='iPad'>iPad</option>
                        </select>
                    </div>
                    <div className='form-group mb-6'>
                        <label htmlFor='description' className='block font-bold mb-2 text-gray-700'>Description of the issue</label>
                        <textarea
                            name='description'
                            id='description'
                            rows={5}
                            className='form-control w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='Please provide detailed information about your issue...'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='form-group'>
                        <button className='btn btn-block w-full bg-black text-white p-4 rounded-lg hover:bg-gray-800 transition font-bold text-lg shadow-md'>
                            Submit Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewTicket;

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import type { RootState } from '../app/store';
import axios from 'axios';

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
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [tags, setTags] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess) {
            navigate('/tickets');
        }
    }, [isError, isSuccess, navigate, message]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('product', product);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('priority', priority);

            // Add tags as array
            const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            tagArray.forEach(tag => formData.append('tags', tag));

            // Add files
            if (files) {
                Array.from(files).forEach(file => {
                    formData.append('attachments', file);
                });
            }

            const token = user?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            await axios.post('http://localhost:5000/api/tickets', formData, config);
            toast.success('Ticket created successfully!');
            navigate('/tickets');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || isSubmitting) {
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
                            required
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
                        <label htmlFor='priority' className='block font-bold mb-2 text-gray-700'>Priority</label>
                        <select
                            name='priority'
                            id='priority'
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                            className='form-control w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value='low'>🟢 Low</option>
                            <option value='medium'>🟡 Medium</option>
                            <option value='high'>🔴 High</option>
                        </select>
                    </div>
                    <div className='form-group mb-6'>
                        <label htmlFor='tags' className='block font-bold mb-2 text-gray-700'>Tags (comma-separated)</label>
                        <input
                            type='text'
                            name='tags'
                            id='tags'
                            className='form-control w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='e.g., bug, urgent, hardware'
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
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
                            required
                        ></textarea>
                    </div>
                    <div className='form-group mb-6'>
                        <label htmlFor='attachments' className='block font-bold mb-2 text-gray-700'>Attachments (max 5 files, 5MB each)</label>
                        <input
                            type='file'
                            name='attachments'
                            id='attachments'
                            multiple
                            accept='image/*,.pdf,.docx,.txt'
                            onChange={(e) => setFiles(e.target.files)}
                            className='form-control w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                        <p className='text-sm text-gray-500 mt-2'>Accepted: Images (JPEG, PNG, GIF), PDF, DOCX, and TXT files</p>
                    </div>
                    <div className='form-group'>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='btn btn-block w-full bg-black text-white p-4 rounded-lg hover:bg-gray-800 transition font-bold text-lg shadow-md disabled:bg-gray-400'
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewTicket;

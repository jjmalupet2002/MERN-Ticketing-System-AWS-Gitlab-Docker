import { useState, useEffect } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import type { RootState, AppDispatch } from '../app/store';
import Spinner from '../components/Spinner';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [isError, isSuccess, user, message, navigate, dispatch]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userData = {
            email,
            password,
        };
        dispatch(login(userData));
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className='container mx-auto px-4 py-16 min-h-[80vh] flex flex-col items-center justify-center'>
            <div className='w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8'>
                <section className='heading flex flex-col items-center justify-center mb-8 text-center'>
                    <h1 className='text-3xl font-bold mb-2 flex items-center gap-3'>
                        <FaSignInAlt className='text-blue-600' /> Login
                    </h1>
                    <p className='text-gray-600'>Please log in to manage support tickets</p>
                </section>

                <section className='form'>
                    <form onSubmit={onSubmit}>
                        <div className='form-group mb-5'>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Email Address</label>
                            <input
                                type='email'
                                className='form-control w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                id='email'
                                name='email'
                                value={email}
                                onChange={onChange}
                                placeholder='Enter your email'
                                required
                            />
                        </div>
                        <div className='form-group mb-8'>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Password</label>
                            <input
                                type='password'
                                className='form-control w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                id='password'
                                name='password'
                                value={password}
                                onChange={onChange}
                                placeholder='Enter password'
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <button className='w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition font-bold shadow-md'>
                                Sign In
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default Login;

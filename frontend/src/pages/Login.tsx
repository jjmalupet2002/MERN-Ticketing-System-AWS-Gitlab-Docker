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
        <div className='container mx-auto px-4 py-8'>
            <section className='heading flex flex-col items-center justify-center py-10 text-center'>
                <h1 className='text-4xl font-bold mb-4 flex items-center'>
                    <FaSignInAlt className='mr-2' /> Login
                </h1>
                <p className='text-xl text-gray-600 font-bold'>Please log in to get support</p>
            </section>

            <section className='form max-w-md mx-auto'>
                <form onSubmit={onSubmit}>
                    <div className='form-group mb-4'>
                        <input
                            type='email'
                            className='form-control w-full p-3 border rounded'
                            id='email'
                            name='email'
                            value={email}
                            onChange={onChange}
                            placeholder='Enter your email'
                            required
                        />
                    </div>
                    <div className='form-group mb-4'>
                        <input
                            type='password'
                            className='form-control w-full p-3 border rounded'
                            id='password'
                            name='password'
                            value={password}
                            onChange={onChange}
                            placeholder='Enter password'
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <button className='btn btn-block w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition'>
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default Login;

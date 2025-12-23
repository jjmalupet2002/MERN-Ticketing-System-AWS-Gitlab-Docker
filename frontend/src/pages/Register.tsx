import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import type { RootState, AppDispatch } from '../app/store';
import Spinner from '../components/Spinner';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { name, email, password, confirmPassword } = formData;

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

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            const userData = {
                name,
                email,
                password,
            };
            dispatch(register(userData));
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <section className='heading flex flex-col items-center justify-center py-10 text-center'>
                <h1 className='text-4xl font-bold mb-4 flex items-center'>
                    <FaUser className='mr-2' /> Register
                </h1>
                <p className='text-xl text-gray-600 font-bold'>Please create an account</p>
            </section>

            <section className='form max-w-md mx-auto'>
                <form onSubmit={onSubmit}>
                    <div className='form-group mb-4'>
                        <input
                            type='text'
                            className='form-control w-full p-3 border rounded'
                            id='name'
                            name='name'
                            value={name}
                            onChange={onChange}
                            placeholder='Enter your name'
                            required
                        />
                    </div>
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
                    <div className='form-group mb-4'>
                        <input
                            type='password'
                            className='form-control w-full p-3 border rounded'
                            id='password2'
                            name='password2'
                            value={confirmPassword}
                            onChange={onChange}
                            placeholder='Confirm password'
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

export default Register;

import { useState, useEffect } from 'react';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState<'user' | 'agent'>('user');

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

    // Password validation logic
    const validatePassword = (pass: string) => {
        const checks = {
            length: pass.length >= 8,
            upper: /[A-Z]/.test(pass),
            number: /[0-9]/.test(pass),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
        };
        return checks;
    };

    const passwordChecks = validatePassword(password);
    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error('Please meet all password requirements');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            const userData = {
                name,
                email,
                password,
                role,
            };
            dispatch(register(userData));
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className='container mx-auto px-4 py-8 min-h-[85vh] flex flex-col items-center justify-center'>
            <div className='w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden'>

                {/* Heading */}
                <section className='heading bg-gray-50 border-b border-gray-200 py-8 text-center'>
                    <h1 className='text-3xl font-bold mb-2 flex items-center justify-center gap-3'>
                        <FaUser className='text-blue-600' /> Register
                    </h1>
                    <p className='text-gray-600'>Join our support community today</p>
                </section>

                <div className='p-8'>
                    {/* Role Selection Tabs */}
                    <div className='flex mb-8 bg-gray-100 p-1 rounded-lg'>
                        <button
                            type='button'
                            onClick={() => setRole('user')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${role === 'user'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Customer
                        </button>
                        <button
                            type='button'
                            onClick={() => setRole('agent')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${role === 'agent'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Support Agent
                        </button>
                    </div>

                    <section className='form'>
                        <form onSubmit={onSubmit}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                <div className='form-group'>
                                    <label className='block text-xs font-bold text-gray-500 uppercase mb-2'>Full Name</label>
                                    <input
                                        type='text'
                                        className='form-control w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                        id='name'
                                        name='name'
                                        value={name}
                                        onChange={onChange}
                                        placeholder='John Doe'
                                        required
                                    />
                                </div>
                                <div className='form-group'>
                                    <label className='block text-xs font-bold text-gray-500 uppercase mb-2'>Email Address</label>
                                    <input
                                        type='email'
                                        className='form-control w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                        id='email'
                                        name='email'
                                        value={email}
                                        onChange={onChange}
                                        placeholder='john@example.com'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                                <div className='form-group'>
                                    <label className='block text-xs font-bold text-gray-500 uppercase mb-2'>Password</label>
                                    <div className='relative'>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className={`form-control w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10 ${password && !isPasswordValid ? 'border-amber-300 bg-amber-50' : 'border-gray-300'
                                                }`}
                                            id='password'
                                            name='password'
                                            value={password}
                                            onChange={onChange}
                                            placeholder='Enter password'
                                            required
                                        />
                                        <button
                                            type='button'
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer'
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label className='block text-xs font-bold text-gray-500 uppercase mb-2'>Confirm Password</label>
                                    <div className='relative'>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className={`form-control w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10 ${confirmPassword && password !== confirmPassword ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-gray-300'}`}
                                            id='password2'
                                            name='confirmPassword'
                                            value={confirmPassword}
                                            onChange={onChange}
                                            placeholder='Repeat password'
                                            required
                                        />
                                        <button
                                            type='button'
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer'
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className='text-red-500 text-xs mt-1'>Passwords do not match</p>
                                    )}
                                </div>
                            </div>

                            {/* Password Requirements UI */}
                            {password && (
                                <div className='mb-8 p-4 bg-gray-50 border border-gray-100 rounded-lg'>
                                    <p className='text-xs font-bold text-gray-400 uppercase mb-3 text-center'>Password Requirements</p>
                                    <div className='grid grid-cols-2 gap-y-2'>
                                        <div className={`text-xs flex items-center gap-2 ${passwordChecks.length ? 'text-green-600' : 'text-gray-400'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${passwordChecks.length ? 'bg-green-600' : 'bg-gray-300'}`} />
                                            8+ Characters
                                        </div>
                                        <div className={`text-xs flex items-center gap-2 ${passwordChecks.upper ? 'text-green-600' : 'text-gray-400'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${passwordChecks.upper ? 'bg-green-600' : 'bg-gray-300'}`} />
                                            Uppercase Letter
                                        </div>
                                        <div className={`text-xs flex items-center gap-2 ${passwordChecks.number ? 'text-green-600' : 'text-gray-400'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${passwordChecks.number ? 'bg-green-600' : 'bg-gray-300'}`} />
                                            At least one number
                                        </div>
                                        <div className={`text-xs flex items-center gap-2 ${passwordChecks.special ? 'text-green-600' : 'text-gray-400'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${passwordChecks.special ? 'bg-green-600' : 'bg-gray-300'}`} />
                                            Special Character
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className='form-group'>
                                <button
                                    className={`w-full p-4 rounded-lg transition font-bold shadow-md ${isPasswordValid && password === confirmPassword && password !== ''
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    disabled={!isPasswordValid || password !== confirmPassword}
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Register;

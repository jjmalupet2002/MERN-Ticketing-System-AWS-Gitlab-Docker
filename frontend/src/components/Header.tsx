import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import type { RootState, AppDispatch } from '../app/store';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <header className='bg-[rgb(10,10,10)] text-white border-b border-gray-800'>
            <div className='container mx-auto px-4 flex justify-between items-center py-5'>
                <div className='logo'>
                    <Link to='/' className='text-xl font-bold hover:text-gray-300 transition'>Support Desk</Link>
                </div>
                <ul className='flex items-center space-x-5'>
                    {user ? (
                        <>
                            <li className='mr-4 font-bold'>
                                Hello, {user.name}
                            </li>
                            <li>
                                <button className='flex items-center space-x-1 btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition' onClick={onLogout}>
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to='/login' className='flex items-center space-x-1 hover:text-gray-300 transition'>
                                    <FaSignInAlt />
                                    <span>Login</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/register' className='flex items-center space-x-1 hover:text-gray-300 transition'>
                                    <FaUser />
                                    <span>Register</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Header;

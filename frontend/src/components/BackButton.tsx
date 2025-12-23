import { FaArrowCircleLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface BackButtonProps {
    url: string;
}

const BackButton = ({ url }: BackButtonProps) => {
    return (
        <div className='mt-5 mb-5'>
            <Link to={url} className='btn bg-black text-white px-5 py-2 rounded shadow flex items-center w-fit hover:bg-gray-800 transition'>
                <FaArrowCircleLeft className='mr-2' /> Back
            </Link>
        </div>
    );
};

export default BackButton;

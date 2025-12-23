function Footer() {
    return (
        <footer className='bg-black text-gray-500 py-6 text-center border-t border-gray-800 mt-auto'>
            <div className='container mx-auto px-4'>
                <p>&copy; {new Date().getFullYear()} Support Desk. All rights reserved.</p>
                <div className='flex justify-center space-x-4 mt-2 text-sm'>
                    <a href='#' className='hover:text-white transition'>Privacy Policy</a>
                    <a href='#' className='hover:text-white transition'>Terms of Service</a>
                    <a href='#' className='hover:text-white transition'>Contact Support</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

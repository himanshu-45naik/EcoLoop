import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
            {/* Logo */}
            <Link to="/" className="text-xl font-semibold flex items-center">
                ♻️ Donation Support
            </Link>

            {/* Search Box */}
            <div className="flex items-center border rounded-full px-4 py-1">
                <input type="text" placeholder="Search" className="outline-none" />
                <button className="bg-red-500 text-white px-4 py-1 rounded-full ml-2">Search</button>
            </div>

            {/* Nav Links */}
            <div className="space-x-6">
                <Link to="/dashboard" className="hover:text-gray-600">Waste Detection Dashboard</Link>
                <Link to="/recycle" className="hover:text-gray-600">Recycle</Link>
                <Link to="/contact" className="hover:text-gray-600">Contact Us</Link>
                <Link to="/logout" className="font-semibold text-black">Logout</Link>
            </div>
        </nav>
    );
}

export default Navbar;

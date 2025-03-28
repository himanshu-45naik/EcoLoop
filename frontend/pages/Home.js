import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-screen">
            <h1 className="text-4xl font-bold mt-8">Automating Waste Management for a Cleaner Future</h1>
            <p className="text-gray-600 mt-4 max-w-2xl">
                Niramay uses AI to optimize waste collection, encourage recycling, and create cleaner communities through citizen participation.
            </p>
            
            <div className="mt-6">
                <Link to="/report" className="bg-green-600 text-white px-6 py-2 rounded-lg mr-4 hover:bg-green-700">
                    Report Waste
                </Link>
                <Link to="/dashboard" className="border border-gray-400 px-6 py-2 rounded-lg hover:bg-gray-100">
                    View Dashboard
                </Link>
            </div>
        </div>
    );
}

export default Home;

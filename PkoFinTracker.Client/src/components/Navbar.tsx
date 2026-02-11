import * as React from "react";
import {useLocation} from "react-router-dom";

const Navbar: React.FC = () => {
    const location = useLocation();
    const pageTitles: Record<string, string> = {
        '/dashboard': "Dashboard",
        '/transactions': "Transactions",
    };
    const pageTitle = pageTitles[location.pathname] || 'Dashboard';
    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-bank-panel border-b border-gray-800">
            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-semibold text-white">{pageTitle}</h1>
            </div>
        </nav>
    );
};

export default Navbar;
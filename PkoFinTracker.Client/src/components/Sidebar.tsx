import * as React from "react";
import {
    LayoutDashboard,
    ArrowLeftRight
} from "lucide-react";
import {NavLink} from "react-router-dom";

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    path: string;
    active?: boolean;
}

const Sidebar: React.FC = () => {
    const menuItems: MenuItem[] = [
        {icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/", active: true },
        {icon: <ArrowLeftRight className="w-5 h-5" />, label: "Transactions", path: "/transactions"}
    ]
    return (
        <aside className="w-64 h-screen bg-bank-panel border-r border-gray-800 flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">FT</span>
                </div>
                <span className="text-white text-xl font-semibold">Financial Tracker</span>
            </div>
            <div className="flex-1 px-4">
                <div className="mb-6">
                    <p className="text-gray-400 text-base font-semibold mb-3">Menu</p>
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? 'bg-bank-purple text-white shadow-md shadow-purple-500/30' 
                                            : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                                    }`
                                }
                            >
                                <div className="flex-shrink-0">
                                    {item.icon}
                                </div>
                                
                                <span className="font-medium text-base">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar;
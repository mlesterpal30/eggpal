import { NavLink } from 'react-router-dom';

type SidebarLink = {
    name: string;
    path: string;
}

type SidebarProps = {
    links: SidebarLink[];
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ links, isOpen, onClose }: SidebarProps) => {
    return (
        <>
            <aside
                className={`
                    fixed top-0 left-0 z-50 w-64 h-screen bg-white font-inter font-medium shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                    </div>
                    
                    <nav className="flex flex-col space-y-2">
                        {links.map((link, index) => (
                            <NavLink
                                key={index}
                                to={link.path}
                                onClick={() => {
                                    // Only close on mobile, keep open on desktop
                                    if (window.innerWidth < 768) {
                                        onClose();
                                    }
                                }}
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-lg transition-colors duration-200 ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
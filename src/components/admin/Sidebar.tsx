import { NavLink } from 'react-router-dom';
import { ReactNode } from 'react';
import { BsEggFried } from 'react-icons/bs';
import { Flex, Text } from '@chakra-ui/react';

type SidebarLink = {
    name: string;
    path: string;
    icon?: ReactNode;
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
                    fixed top-0 left-0 z-50 w-64 h-screen bg-white font-geist font-medium shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="mb-8">
                        <Flex alignItems="center" gap={2}> 
                             <BsEggFried className="text-3xl" />
                            <Text fontFamily="londrina" fontSize="4xl" fontWeight="bold">EggPal Farm</Text>
                        </Flex>
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
                                    `px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                {link.icon && <span className="text-lg">{link.icon}</span>}
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
import { Text, Flex, IconButton } from "@chakra-ui/react";
import Notification from "./Notification";
import Settings from "./Settings";

type NavbarProps = {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
}

const Navbar = ({ onMenuClick, isSidebarOpen }: NavbarProps) => {
    return (
        <Flex 
            bg="#F5F7FB" 
            w="full" 
            p={4}
            alignItems="center"
            className="shadow-sm"
            justifyContent="space-between"
            align="center"
        >
            {/* Hamburger menu button - visible on all screen sizes */}
            <button
                onClick={onMenuClick}
                className="mr-4 p-2 rounded-md hover:bg-gray-200 transition-colors"
                aria-label="Toggle menu"
            >
                {isSidebarOpen ? (
                    <svg
                        className="w-6 h-6 text-gray-700"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                ) : (
                    <svg
                        className="w-6 h-6 text-gray-700"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                )}
            </button>
            <Flex alignItems="center" gap={2}>
                <Notification />
                <Settings />
            </Flex>
        </Flex>
    );
}

export default Navbar;
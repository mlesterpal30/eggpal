import { useState, useEffect } from "react";
import { Flex, useToast } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { FaChartBar } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { FaBox } from "react-icons/fa";
import { useNotificationHub } from "../../hooks/hubs/NotificationHub";
import { FaCalendarAlt } from "react-icons/fa";

const AdminLayout = () => {
    const toast = useToast();

    // Initialize sidebar as open on large screens, closed on small screens
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        return window.innerWidth >= 768;
    });

    // NotificationHub connection for real-time notifications
    useNotificationHub({
        onNotificationReceived: (message: string, type: string) => {
            const status = type === 'HarvestReminder' ? 'warning' : 'info';

            toast({
                title: 'Notification',
                description: message,
                status: status,
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            });
        },
    });

    const links = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <FaChartBar />,
        },
        {
            name: "Finance",
            path: "/admin/finance",
            icon: <BsCashCoin />,
        },
        {
            name: "Inventory",
            path: "/admin/inventory",
            icon: <FaBox />,
        },
        {
            name: "Calendar",
            path: "/admin/calendar",
            icon: <FaCalendarAlt />,
        },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            <Sidebar
                links={links}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />

            <Flex
                direction="column"
                minH="100vh"
                className={`flex-1 w-full transition-all duration-300 ${
                    isSidebarOpen ? 'md:ml-64' : ''
                }`}
            >
                <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <div className="flex-1 p-4 md:p-6">
                    <Outlet />
                </div>
            </Flex>
        </div>
    );
};

export default AdminLayout;

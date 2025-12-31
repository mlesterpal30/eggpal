import { Box } from "@chakra-ui/react";
import {Outlet } from "react-router-dom"
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const AdminLayout = () => {
    return (
        <>
            <Sidebar />
            <Box>
                <Navbar />
                <Outlet/>
            </Box>
        </>
    )
}

export default AdminLayout;
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./components/pages/AdminLayout"
import Dashboard from "./components/Dashboard";
import Crud from "./components/Crud";

const router = createBrowserRouter([
	{
		path: "/",
		element: <AdminLayout />,
		children: [
			{
				index: true,
				element: <Dashboard />,
			},
			{
				path: "crud",
				element: <Crud />,
			},
		],
	},
]);

export default router;
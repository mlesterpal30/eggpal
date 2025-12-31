import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./components/pages/AdminLayout"
import Dashboard from "./components/Dashboard";

const router = createBrowserRouter([
	{
		path: "/",
		element: <AdminLayout />,
		children: [
			{
				index: true,
				element: <Dashboard />,
			},
		],
	},
]);

export default router;
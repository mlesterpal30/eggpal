import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./components/pages/AdminLayout"
import Dashboard from "./components/Dashboard";
import Crud from "./components/Crud";
import App from "./App";
import Sales from "./components/Sales";
import Inventory from "./components/Inventory";

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
			{
				path: "sales",
				element: <Sales />,
			},
			{
				path: "inventory",
				element: <Inventory />,
			},
		],
	
	},
	{
		path: "/app",
		element: <App />,
	}
]);

export default router;
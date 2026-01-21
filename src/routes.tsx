import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./components/pages/AdminLayout"
import Dashboard from "./components/Dashboard";
import Crud from "./components/Crud";
import App from "./App";
import Sales from "./components/Sales";
import Inventory from "./components/Inventory";
import Finance from "./components/Finance";
import Calendar from "./components/Calendar";

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
			{
				path: "finance",
				element: <Finance />,
			},
			{
				path: "calendar",
				element: <Calendar />,
			},
		],
	
	},
	{
		path: "/app",
		element: <App />,
	}
]);

export default router;
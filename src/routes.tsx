import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import Crud from "./components/admin/Crud";
import App from "./App";
import Sales from "./components/admin/Sales";
import Inventory from "./components/admin/Inventory";
import Finance from "./components/admin/Finance";
import Calendar from "./components/admin/Calendar/Calendar";
import Customer from "./components/customer/Customer";
import CustomerLayout from "./components/customer/CustomerLayout";
import Order from "./components/customer/Order";
import Profile from "./components/customer/Profile";
import Location from "./components/customer/order/location/Location";

const router = createBrowserRouter([
	{
		path: "/",
		element: <CustomerLayout />,
		children: [
			{
				index: true,
				element: <Order />,
			},
			{
				path: "profile",
				element: <Profile />,
			},
		],
	},
	{
		path: "/location",
		element: <Location />,
	},
	{
		path: "/admin",
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
	},
]);

export default router;

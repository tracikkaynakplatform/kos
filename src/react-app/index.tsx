import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "kos-fe/constants/router";
import { Modal } from "kos-fe/components/Modals/Modal";
import { ToastContainer } from "react-toastify";
import "kos-fe/style/index.css";
import "react-toastify/dist/ReactToastify.css";

const element = document.getElementById("root");

if (element) {
	const root = ReactDOM.createRoot(element);
	root.render(
		<>
			<RouterProvider router={router} />
			<Modal />
			<ToastContainer />
		</>
	);
} else {
	throw new Error("Unable to find root element");
}

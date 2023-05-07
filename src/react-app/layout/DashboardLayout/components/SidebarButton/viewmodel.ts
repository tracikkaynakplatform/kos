import { useLocation, useNavigate } from "react-router-dom";

export function useViewModel() {
	const navigate = useNavigate();
	const location = useLocation();

	const navigateToPage = (href: string) => {
		navigate(href, { replace: true });
	};

	const isActive = (href: string): boolean => {
		return location.pathname.startsWith(href);
	};

	return {
		navigateToPage,
		isActive,
	};
}

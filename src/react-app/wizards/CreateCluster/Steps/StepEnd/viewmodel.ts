import { useNavigate } from "react-router-dom";

export function useViewModel() {
	const navigate = useNavigate();

	const returnToMainPage = () => navigate(-1, { replace: true });

	return {
		returnToMainPage,
	};
}

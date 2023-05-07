import { useNavigate } from "react-router-dom";

export function useViewModel() {
	const navigate = useNavigate();

	const goNext = () => navigate(-1);

	return {
		goNext,
	};
}

import { useReversibleLayout } from "kos-fe/contexts/ReversibleLayoutContext";
import { useNavigate } from "react-router-dom";

export function useViewModel() {
	const navigate = useNavigate();
	const { isBackEnabled, onBackClick } = useReversibleLayout();
	const goBack = onBackClick ?? (() => navigate(-1));

	return {
		goBack,
		isBackEnabled,
	};
}

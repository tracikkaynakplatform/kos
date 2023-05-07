import { Link } from "react-router-dom";

export function NotFoundPage() {
	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<div className="text-xl">
				Page not found.
				<Link className="text-blue-400" to="/">
					Return to main page
				</Link>
			</div>
		</div>
	);
}

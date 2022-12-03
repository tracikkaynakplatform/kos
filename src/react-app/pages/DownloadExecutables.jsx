import React from "react";
import { LinearProgress } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { services } from "../api";

async function tryToPrepare(foo) {
	let tryCount = 0;
	let maxTry = 5;

	while (tryCount < maxTry && (await foo()).status != "ok") continue;

	if (tryCount != maxTry) return true;
	return false;
}

export default function DownloadExecutables() {
	const [message, setMessage] = useState("");
	const nav = useNavigate();

	useEffect(() => {
		(async () => {
			setMessage("kubectl varlığı denetleniyor");

			if (!(await services.checkKubectl())) {
				setMessage("kubectl indiriliyor");

				while (!(await tryToPrepare(services.prepareKubectl)))
					setMessage(
						"kubectl indirmesi başarısız! yeniden deneniyor"
					);
			}
			nav("/");
		})();
	}, []);

	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<div className="w-96 h-52 shadow-2xl bg-white border-2 border-baltic-200 rounded-lg flex flex-col items-center gap-10 p-3 justify-center">
				Çalıştırılabilir dosyalar indiriliyor...
				<div>{message}</div>
				<div className="w-full">
					<LinearProgress variant="indeterminate" color="primary" />
				</div>
			</div>
		</div>
	);
}

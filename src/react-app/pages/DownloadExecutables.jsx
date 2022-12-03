import React from "react";
import { LinearProgress } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { services } from "../api";

async function tryToPrepare(foo, serviceName) {
	let tryCount = 0;
	let maxTry = 5;

	while (tryCount < maxTry && (await foo(serviceName)).status != "ok")
		tryCount++;
	if (tryCount != maxTry) return true;
	return false;
}

export default function DownloadExecutables() {
	const [message, setMessage] = useState("");
	const nav = useNavigate();
	const exes = ["kubectl", "clusterawsadm", "clusterctl"];

	const checkExe = async (name) => {
		setMessage(`${name} varlığı denetleniyor`);

		if (!(await services.checkService(name)).status) {
			setMessage(`${name} indiriliyor`);

			while (!(await tryToPrepare(services.prepareService, name)))
				setMessage(`${name} indirmesi başarısız! yeniden deneniyor`);
		}
		console.log(name);
	};

	useEffect(() => {
		(async () => {
			for (let exe of exes) await checkExe(exe);
			nav("/management-clusters");
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

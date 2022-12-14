import React from "react";
import { LinearProgress } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { services } from "../api";
import { useModal } from "../hooks/useModal";
import { MessageModal } from "../components/Modals";

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
	const modal = useModal();
	const exes = ["kubectl", "clusterawsadm", "clusterctl"];

	const checkExe = async (name) => {
		setMessage(`${name} varlığı denetleniyor`);

		if (!(await services.checkService(name)).status) {
			setMessage(`${name} indiriliyor`);

			while (!(await tryToPrepare(services.prepareService, name)))
				setMessage(`${name} indirmesi başarısız! yeniden deneniyor`);
		}
	};

	useEffect(() => {
		(async () => {
			for (let exe of exes) await checkExe(exe);
			if (!(await services.checkService("aws")).status) {
				setMessage("aws-cli aracı indiriliyor");
				if (!(await tryToPrepare(services.prepareService, "aws")))
					modal.showModal(MessageModal, {
						message: (
							<>
								aws-cli aracı indirmesi başarısız oldu. KOS'u
								yeniden başlatmayı veya aws-cli aracını{" "}
								<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html">
									burada
								</a>
								tarif edildiği şekilde sisteminize kurarak PATH
								üzerine ekleyin.
								<br />
								AWS sağlayıcısı üzerinde küme oluşturmak için
								aws-cli aracını kurmanız gerekiyor.
							</>
						),
					});
			}
			nav("/management-clusters");
		})();
	}, []);

	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<div className="shadow-2xl bg-white border-2 border-baltic-200 rounded-lg flex flex-col items-center gap-10 p-5 justify-center">
				KOS işlemleri gerçekleştirmek için {exes.join(", ")} ve aws-cli
				çalıştırılabilir dosyalarına ihtiyaç duyuyor.
				<br />
				<br />
				Çalıştırılabilir dosyalar indiriliyor...
				<div>{message}</div>
				<div className="w-full">
					<LinearProgress variant="indeterminate" color="primary" />
				</div>
			</div>
		</div>
	);
}

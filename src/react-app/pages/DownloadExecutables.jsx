import React from "react";
import { LinearProgress } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { services } from "../api";
import { useModal } from "../hooks/useModal";
import { MessageModal } from "../components/Modals";
import { logger } from "../../main/logger";

async function tryToPrepare(foo, serviceName) {
	let tryCount = 1;
	let maxTry = 5;

	while (tryCount <= maxTry) {
		if ((await foo(serviceName)).status == "ok") break;
		tryCount++;
		logger.error(
			`${tryCount}/${maxTry} ${serviceName} couldn't download! Trying again...`
		);
	}
	if (tryCount != maxTry + 1) {
		logger.log(`${serviceName} downloaded!`);
		return true;
	}
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
							<div>
								aws-cli aracı bulunamadı. Lütfen KOS'u yeniden
								başlatmayı deneyin veya{" "}
								<a
									className="inline-block"
									onClick={() =>
										os.openLink(
											"https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
										)
									}
								>
									bu adreste
								</a>{" "}
								tarif ediliği şekilde aws-cli aracını kurun ve
								YOL üzerine ekleyin.
								<br />
								AWS sağlayıcısı üzerinde küme oluşturmak için
								aws-cli aracını kurmanız gerekiyor.
							</div>
						),
					});
			}
			nav("/management-clusters");
		})();
	}, []);

	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<div className="shadow-2xl w-[40%] bg-white border-2 border-baltic-200 rounded-lg flex flex-col items-center gap-10 p-5 justify-center">
				<div className="flex flex-col gap-5">
					<h1 className="text-xl font-bold">
						Çalıştırılabilir dosyalar indiriliyor...
					</h1>
					<p>
						KOS işlemleri gerçekleştirmek için {exes.join(", ")} ve
						aws-cli çalıştırılabilir dosyalarına ihtiyaç duyuyor.
					</p>
				</div>
				<div className="font-bold italic">{message}...</div>
				<div className="w-full">
					<LinearProgress variant="indeterminate" color="primary" />
				</div>
			</div>
		</div>
	);
}

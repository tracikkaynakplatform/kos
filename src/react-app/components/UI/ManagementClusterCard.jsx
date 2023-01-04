import React from "react";
import { providerNames, providerLogos } from "../../providers";
import { useNavigate } from "react-router-dom";
import ProviderChip from "./ProviderChip";

export default function ManagementClusterCard({
	name,
	clusters,
	href,
	supportedProviders,
	connError,
}) {
	const nav = useNavigate();
	return (
		<div
			className="flex flex-col w-[325px] h-[300px] shadow-xl rounded-lg border-[0.1px] border-emerald-400 transition-all duration-300 hover:bg-gray-100 hover:cursor-pointer p-4 gap-1"
			onClick={() => nav(href)}
		>
			<div className="font-bold text-black text-xl">{name}</div>
			<hr />
			{!!!connError ? (
				<>
					<div className="flex-grow p-1">
						Desteklenen Altyapılar
						<div className="flex flex-wrap gap-1 mt-3">
							{supportedProviders?.map((x, i) => (
								<ProviderChip
									key={i}
									name={providerNames[x]}
									logo={providerLogos[x]}
								/>
							))}
						</div>
					</div>
					<hr />
					<div>Kümeler</div>
					<div className="p-2 flex gap-1 overflow-hidden">
						{clusters?.length > 0 ? (
							clusters?.map((x, i) => (
								<ProviderChip
									key={i}
									name={x.name}
									logo={providerLogos[x.provider]}
									href={x.href}
									status={x.status}
								/>
							))
						) : (
							<div className="w-full text-center italic items-center font-sans">
								Henüz küme oluşturmadınız...
							</div>
						)}
					</div>
				</>
			) : (
				<div className="w-full text-center italic items-center font-sans">
					Yönetim kümesi ile bağlantı kurulamadı.
				</div>
			)}
		</div>
	);
}

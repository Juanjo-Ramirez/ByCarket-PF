"use client";

import { useRouter } from "next/navigation";
import { Star, Infinity, Cpu, Repeat } from "lucide-react";

export default function SuscriptionView() {
	const router = useRouter();

	const features = [
		{
			icon: <Infinity size={48} className='text-yellow-400' />,
			title: "Publicaciones ilimitadas",
			description:
				"Publicá todos los vehículos que quieras, sin límite alguno, para maximizar tus ventas.",
		},
		{
			icon: <Cpu size={48} className='text-yellow-400' />,
			title: "Creación de contenido con IA",
			description:
				"Genera descripciones y anuncios atractivos automáticamente con la ayuda de inteligencia artificial.",
		},
		{
			icon: <Repeat size={48} className='text-yellow-400' />,
			title: "Automatización de publicaciones",
			description:
				"Programa y automatiza tus publicaciones para que siempre estén activas y visibles en el momento justo.",
		},
	];

	return (
		<section className='relative w-full bg-principal-blue text-white py-20 px-6'>
			<div className='max-w-5xl mx-auto text-center'>
				<Star size={60} className='mx-auto mb-6 text-yellow-400' />
				<h1 className='text-5xl font-extrabold mb-6'>
					Suscripción PREMIUM
				</h1>
				<p className='text-lg max-w-3xl mx-auto mb-16'>
					Potencia tu experiencia en ByCarket con beneficios
					exclusivos pensados para vendedores profesionales y usuarios
					que quieren lo mejor.
				</p>

				<div className='grid md:grid-cols-3 gap-12 mb-16'>
					{features.map(({ icon, title, description }, i) => (
						<div
							key={i}
							className='bg-white/10 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition cursor-default'>
							<div className='mb-4 flex justify-center'>
								{icon}
							</div>
							<h3 className='text-2xl font-semibold mb-3'>
								{title}
							</h3>
							<p className='text-white/90'>{description}</p>
						</div>
					))}
				</div>

				<button
					onClick={() => router.push("/dashboard?tab=premium")}
					className='bg-yellow-400 text-gray-900 font-extrabold text-xl px-12 py-5 rounded-3xl shadow-lg hover:bg-yellow-500 transition'>
					¡Hazte PREMIUM ahora!
				</button>
			</div>
		</section>
	);
}

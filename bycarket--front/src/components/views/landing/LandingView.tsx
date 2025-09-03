import BuySection from "./components/BuySection";
import CTA from "./components/CTA";

import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import SellSection from "./components/SellSection";

export default function LandingView() {
	return (
		<main>
			<Hero />
			<HowItWorks />
			<BuySection />
			<SellSection />
			<CTA />
		</main>
	);
}

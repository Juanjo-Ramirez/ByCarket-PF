"use client";

import FeaturedProducts from "./components/FeaturedProducts";
import PrincingComponent from "./components/ExploreTypesSection";
import HomeBanner from "./components/HomeBanner";

export default function HomeView() {
  return (
    <>
      <HomeBanner />
      <FeaturedProducts />
      <PrincingComponent />
    </>
  );
}

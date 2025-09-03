import React from "react";
import ScrapperHeader from "./admin/scrapper/ScrapperHeader";
import ScrapperDescription from "./admin/scrapper/ScrapperDescription";
import ScrapperButton from "./admin/scrapper/ScrapperButton";

export default function DatabaseScrapperContent() {
  return (
    <div className="w-full">
      <ScrapperHeader />
      <ScrapperDescription />
      <ScrapperButton />
    </div>
  );
}

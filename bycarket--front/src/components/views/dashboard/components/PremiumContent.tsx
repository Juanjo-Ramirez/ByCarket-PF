"use client";
import { useState } from "react";
import { PaymentHeader } from "../payment/PaymentHeader";
import { SubscriptionCards } from "../payment/Subs";
import Checkout from "../payment/EmbeddedCheckout";

export default function PremiumContent() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div id="checkout">
      <PaymentHeader />
      <SubscriptionCards
        onSelectPlan={setSelectedPlan}
        selectedPlanId={selectedPlan}
      />
      {selectedPlan && <Checkout priceId={selectedPlan} />}
    </div>
  );
}

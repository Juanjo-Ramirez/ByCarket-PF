"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { fetchClientSecret } from "@/app/actions/stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface EmbeddedCheckoutProps {
  priceId: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: any) => void;
}

export default function Checkout({
  priceId,
  onSuccess,
  onError,
}: EmbeddedCheckoutProps) {
  const fetchClientSecretWithPrice = async () => {
    try {
      if (!priceId) {
        throw new Error("No se ha seleccionado un plan");
      }
      return await fetchClientSecret(priceId);
    } catch (error) {
      onError?.(error);
      throw error;
    }
  };

  return (
    <div id="checkout" className="mt-20">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: fetchClientSecretWithPrice }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

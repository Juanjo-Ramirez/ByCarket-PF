"use server";

import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function fetchClientSecret(priceId: string): Promise<string> {
  const headersList = await headers();
  const origin = headersList.get("origin") || "";

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.client_secret) {
    throw new Error("No se pudo obtener el client secret");
  }

  return session.client_secret;
}

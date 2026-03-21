import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;

    if (userId) {
      const supabase = await createClient();
      await supabase
        .from("profiles")
        .upsert({ id: userId, is_pro: true, stripe_customer_id: session.customer });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const supabase = await createClient();
    await supabase
      .from("profiles")
      .update({ is_pro: false })
      .eq("stripe_customer_id", subscription.customer);
  }

  return NextResponse.json({ received: true });
}

import { subscribeUser } from "../../../services/newsletter.service.js";

export async function POST(req) {
  const { email } = await req.json();

  try {
    await subscribeUser(email); // this adds jobs to the queue
    return new Response(JSON.stringify({ message: "Subscription successful" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Subscription failed" }), { status: 500 });
  }
}
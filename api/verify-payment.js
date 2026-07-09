const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({
      error: "Missing session_id"
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return res.status(200).json({
      paid: session.payment_status === "paid"
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Unable to verify payment"
    });
  }
};
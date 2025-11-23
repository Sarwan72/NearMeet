import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// const stripe = new Stripe("");
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);

if (!stripe) {
  console.log("Stripe failed to initialize");
} else {
  console.log("Stripe initialized successfully");
}



router.post("/checkout", async (req, res) => {
  try {
    const { bookingId, amount } = req.body;


    if (!bookingId || !amount) {
      return res.status(400).json({ message: "Missing booking details" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Hotel Booking Payment",
            },
            unit_amount: amount * 100, // Convert ₹ to Paisa
          },
          quantity: 1,
        },
      ],

      mode: "payment",

     success_url: `http://localhost:5173/payment?status=success&bookingId=${bookingId}`,
cancel_url:  `http://localhost:5173/payment?status=failed`,

    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ message: "Stripe session failed" });
  }
});

export default router;

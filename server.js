import express from "express";
import dotenv from "dotenv";
import { Duffel } from "@duffel/api";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY, // Your Duffel Test API Key
});

app.get("/", (req, res) => {
  res.send("Duffel Flight API backend is running.");
});

app.get("/api/search-flights", async (req, res) => {
  const { origin, destination, departureDate, adults } = req.query;

  try {
    const offerRequest = await duffel.offerRequests.create({
      slices: [
        {
          origin,
          destination,
          departure_date: departureDate,
        },
      ],
      passengers: Array(Number(adults)).fill({ type: "adult" }),
      cabin_class: "economy",
    });

    res.json(offerRequest);
  } catch (error) {
    console.error("Duffel API Error:", error);
    res.status(500).json({ error: "Failed to fetch flight data from Duffel." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

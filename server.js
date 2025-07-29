import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Duffel Flight API backend is running.");
});

app.get("/api/search-flights", async (req, res) => {
  const { origin, destination, departureDate, adults } = req.query;

  try {
    const response = await fetch("https://api.duffel.com/air/offer_requests", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DUFFEL_API_KEY}`,
        "Content-Type": "application/json",
        "Duffel-Version": "v1"  // <-- FIXED VERSION
      },
      body: JSON.stringify({
        data: {
          slices: [{ origin, destination, departure_date: departureDate }],
          passengers: Array(Number(adults)).fill({ type: "adult" }),
          cabin_class: "economy"
        }
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching Duffel flights:", error);
    res.status(500).json({ error: "Failed to fetch Duffel flight data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

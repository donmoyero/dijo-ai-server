export default async function handler(req, res) {

  // Allow GitHub Pages to call this API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { brief } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "user", content: brief }
        ]
      })
    });

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content || "No response";

    return res.status(200).json({ text });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: "AI generation failed"
    });

  }
}

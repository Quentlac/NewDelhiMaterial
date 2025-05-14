// src/pages/api/image-search.ts
export default async function handler(req, res) {
  const { query } = req;
  const searchTerm = query.q;

  const apiKey = process.env.UNSPLASH_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing Unsplash API key" });
  }

  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=1`, {
      headers: {
        Authorization: `Client-ID ${apiKey}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from Unsplash" });
    }

    const data = await response.json();
    const imageUrl = data?.results?.[0]?.urls?.thumb || null;

    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching image from Unsplash" });
  }
}
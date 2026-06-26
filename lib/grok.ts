const GROK_API_KEY = process.env.NEXT_PUBLIC_XAI_API_KEY; // Thêm vào .env.local

export const getGrokSuggestion = async (prompt: string) => {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Grok API error:", error);
    return null;
  }
};
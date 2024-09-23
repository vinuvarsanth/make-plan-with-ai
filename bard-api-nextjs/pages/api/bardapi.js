// pages/api/bardapi.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Handle GET request query parameters
    const input = req.query.ques || 'No input provided';

    const result = await chatSession.sendMessage(input);
    res.status(200).json({ text: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

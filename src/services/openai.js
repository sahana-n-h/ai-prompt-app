import axios from 'axios';

// Relaying requests through the Vite proxy (/openai → https://api.openai.com)
// to avoid CORS issues on dev. In prod, point this to backend endpoint.
const OPENAI_API_URL = '/openai/v1/chat/completions';

export async function fetchAIResponse(prompt, apiKey) {
  if (!apiKey) {
    throw new Error(
      'Missing OpenAI API key. Please set OPENAI_API_KEY in your .env file.'
    );
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.error?.message || 'Unknown API error.';

      if (status === 401) {
        throw new Error('Invalid API key. Please check your OPENAI_API_KEY.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (status === 500) {
        throw new Error('OpenAI server error. Please try again later.');
      } else {
        throw new Error(`API Error (${status}): ${message}`);
      }
    } else if (err.request) {
      throw new Error('No response from OpenAI. Check your internet connection.');
    } else {
      throw new Error(err.message || 'An unexpected error occurred.');
    }
  }
}

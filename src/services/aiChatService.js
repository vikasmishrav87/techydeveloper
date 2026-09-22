// TechyDeveloper AI Client Service
// All confidential API keys and upstream communications are proxied via backend serverless /api/ai-chat

export async function sendAIChatMessage(conversationHistory = [], userMessage = '', model = 'openai/gpt-4o-mini') {
  try {
    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationHistory,
        userMessage,
        model
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `AI Gateway responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.reply) {
      throw new Error('Empty response received from AI service');
    }

    return data.reply;
  } catch (error) {
    console.warn('sendAIChatMessage fallback:', error.message);
    // Return friendly resilient fallback with direct WhatsApp link
    return `I am temporarily encountering a network latency spike with the AI gateway. 

You can connect directly with our **Principal Architect & Executive Team** on WhatsApp right now for an immediate response:
👉 **[Chat on WhatsApp with Executive Team (+91 83698 04739)](https://wa.me/918369804739?text=Hi,%20I%20have%20an%20engineering%20question%20regarding%20TechyDeveloper.)**

Or message us on Telegram: **[Official Telegram](https://t.me/Yourstrulyvikasmishra)**`;
  }
}

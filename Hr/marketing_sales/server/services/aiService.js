const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Predict lead conversion score
 */
exports.getLeadScore = async (leadData) => {
  try {
    // For demo, if no API key, return mock data
    if (!process.env.OPENAI_API_KEY) {
      return {
        score: Math.floor(Math.random() * 100),
        reason: "Based on historical engagement patterns and industry segment."
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a sales intelligence assistant. Analyze lead data and provide a conversion score (0-100) and a brief reason."
        },
        {
          role: "user",
          content: JSON.stringify(leadData)
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI Lead Scoring Error:', error);
    return { score: 50, reason: "Error calculating score." };
  }
};

/**
 * Generate marketing email content
 */
exports.generateEmail = async (campaignData) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return "Hello, this is a placeholder email content for the " + campaignData.name + " campaign.";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional marketing copywriter. Generate a high-converting email based on the provided campaign details."
        },
        {
          role: "user",
          content: JSON.stringify(campaignData)
        }
      ]
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI Email Generation Error:', error);
    return "Error generating email.";
  }
};

/**
 * Analyze customer sentiment from text
 */
exports.analyzeSentiment = async (text) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      const sentiments = ['Positive', 'Neutral', 'Negative'];
      return { 
        sentiment: sentiments[Math.floor(Math.random() * 3)],
        confidence: 0.85,
        keywords: ['service', 'pricing', 'interested']
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Analyze the sentiment of the following text. Return a JSON object with 'sentiment' (Positive/Neutral/Negative), 'confidence' (0-1), and 'keywords' (array)."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Sentiment Analysis Error:', error);
    return { sentiment: 'Neutral', confidence: 0.5 };
  }
};

/**
 * Predict sales forecast based on pipeline
 */
exports.getSalesForecast = async (dealsData) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        predictedRevenue: 125000,
        growthRate: "12%",
        insight: "Expected growth driven by high-value enterprise deals in the proposal stage."
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst. Based on the provided deal pipeline data, predict next month's revenue and provide one key insight. Return JSON with 'predictedRevenue', 'growthRate', and 'insight'."
        },
        {
          role: "user",
          content: JSON.stringify(dealsData)
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Sales Forecast Error:', error);
    return { predictedRevenue: 0, growthRate: "0%" };
  }
};

const OpenAI = require("openai");
const NodeCache = require("node-cache");
const creds = require("./openAi_creds.json");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const ga4creds = require("./credentials.json");

const projectId = ga4creds.project_id;
const cache = new NodeCache({ stdTTL: 1800 }); 

const llm = new OpenAI({
  apiKey: creds.API_KEY
});

const agentTools = [
  {
    type: "function",
    function: {
      name: "fetchGA4Data",
      description: "Get a specified metric's data on a date range",
      parameters: {
        type: "object",
        properties: {
          metric: { type: "string" },
          dateRange: { type: "string" }
        },
        required: ["metric", "dateRange"],
        additionalProperties: false
      },
      strict: true
    }
  }
];

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: ga4creds,
  projectId: projectId
});

async function getLLMResponse(user_query) {
  const system_prompt = `
    You are an expert web analytics assistant. Your primary role is to analyze webpage performance metrics, interpret user engagement data, and provide actionable insights and recommendations. 

    Your analysis should consider the following metrics:
    - Engagement Rate: The percent of sessions where users remain engaged, defined as sessions lasting longer than 2 seconds or having at least 2 page views.
    - Engagement Time: The average time users actively view and interact with a webpage.
    - Page Views: The total number of times users have viewed a webpage.
    - Total and New Users: Total visitors to a page including both new and returning users, with an ideal range of 30%-50% new users depending on page goals.
    - Scroll Depth: How far down users scroll on a webpage, segmented by percentages (10%, 25%, 50%, 75%, 90%, and 100%).
    - Video Performance Metrics: Video play rate, video duration watched, percent of video watched, and viewer retention throughout the video timeline.
    - Path Exploration: Additional pages visited during the user session.

    Use a clear, professional yet approachable language style, avoiding overly technical jargon. Provide direct and succinct recommendations based on data-driven insights, structured clearly into:
    - Observations: What the metrics explicitly indicate about user behavior.
    - Interpretations: Reasons behind observed user behaviors, such as low engagement or high bounce rates.
    - Actionable Recommendations: Concrete next steps, such as content reorganization, adjustments in video placement, optimal video length, simplification of text content, and strategies for sharing content (emails, links, QR codes, sales communication).

    Always suggest methods to simplify webpage content for improved scanability (short sentences, bullet points, straightforward language). Address video-specific issues by reviewing introductions, relevance, conclusions (recaps), professional yet approachable presentation style, and placement on webpages.

    Conclude responses with clearly defined next steps to guide users efficiently.        
  `;

  const streamResponse = await llm.chat.completions.create({
    model: "gpt-4o-2024-11-20",
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_query }
    ],
    stream: true
  });

  for await (const chunk of streamResponse) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

async function fetchGA4Data(metric, dateRange) {
  const cacheKey = `${metric}_${dateRange}`;

  // Check cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Returning cached GA4 data");
    return cachedData;
  }

  const [startDate, endDate] = dateRange.split("/");

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${projectId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: metric }],
    dimensions: [{ name: "pagePath" }]
  });

  // Store in cache
  cache.set(cacheKey, response);
  console.log("Cached GA4 data");

  return response;
}

module.exports = { getLLMResponse, fetchGA4Data };

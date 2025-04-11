const OpenAI = require("openai");
const NodeCache = require("node-cache");
const creds = require("./openAi_creds.json");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const ga4creds = require("./credentials.json");

const PROPERTY_ID = '324172901';
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
          metric: { type: "string", description:"Camel case typing" },
          startDate: { type: "string", description:"NdaysAgo" },
          endDate: { type: "string", description:"yesterday" }
        },
        required: ["metric", "startDate", "endDate"],
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
    You are an expert web analytics assistant. Your primary role is to analyze webpage performance metrics, interpret data, and provide insights and recommendations. 

    Your analysis should consider the following metrics:
    - engagementRate: Percent of sessions where users remain engaged, defined as sessions > 2 seconds or having 2 > page views.
    - engagementTime: Average time users actively view and interact with a webpage.
    - screenPageViews: Total number of times users have viewed a webpage.
    - Total and New Users: Total visitors to a page including both new and returning users, with an ideal range of 30%-50% new users depending on page goals.
    - Scroll Depth: How far down users scroll on a webpage, segmented by percentages (10%, 25%, 50%, 75%, 90%, 100%).
    - Video Performance Metrics: Video play rate, duration watched,% video watched, and viewer retention throughout its timeline.
    - Path Exploration: Additional pages visited during the user session.

    Use a professional, yet approachable language style, avoiding overly technical jargon. Provide direct recommendations based on data-driven insights, structured into:
    - Observations: What the metrics explicitly indicate about user behavior.
    - Interpretations: Reasons behind observed user behaviors, such as low engagement or high bounce rates.
    - Actionable Recommendations: Concrete next steps, such as content reorganization, adjustments in video placement, optimal video length, simplification of text content, and strategies for sharing content (emails, links, QR codes, sales communication).

    Always suggest methods to simplify webpage content for improved scanability (short sentences, bullet points, straightforward language). Address video-specific issues by reviewing introductions, relevance, conclusions (recaps), professional yet approachable presentation style, and placement on webpages.
    Conclude responses with clearly defined next steps to guide users efficiently.        
  `;

    const message_history = [
        { role: "system", content: system_prompt },
        { role: "user", content: user_query }
    ]

    const completionResponse = await llm.chat.completions.create({
        model: "gpt-4o-2024-11-20",
        messages: message_history,
        tools: agentTools,
        stream: false
    });

    const message = completionResponse.choices[0].message;

    if(message.tool_calls){
        const funcName = message.tool_calls[0].function.name;
        let args;
        try {
            args = JSON.parse(message.tool_calls[0].function.arguments);
            console.log("The arguments pased to the function are: ",args)
        } catch (error) {
            console.error("Error parsing function call arguments", error);
            return;
        }

        if(funcName == "fetchGA4Data"){
            const result = await fetchGA4Data(args.metric, args.startDate, args.endDate);
            message_history.push({
                role:"function",
                name: funcName,
                content: JSON.stringify(result)
            }) // sys_p + u_q + result

            const followUpResponse = await llm.chat.completions.create({
                model: "gpt-4o-2024-11-20",
                messages: message_history,
                tools: agentTools,
                stream: true
            });

            for await (const chunk of followUpResponse) {
                process.stdout.write(chunk.choices[0]?.delta?.content || "");
            }
            return;
        }
    } else {
        console.error("Unsupported function call", funcName);
        return;
    }

    const streamResponse = await llm.chat.completions.create({
        model: "gpt-4o-2024-11-20",
        messages: message_history,
        tools: agentTools,
        stream: true
    });
    
    for await (const chunk of streamResponse) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
}

async function fetchGA4Data(metric, startDate, endDate) {
  const cacheKey = `${metric}_${startDate}-${endDate}`;

  // Check cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Returning cached GA4 data");
    return cachedData;
  }

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: metric }],
    dimensions: [{ name: "yearMonth" }]
  });

  // Store in cache
  cache.set(cacheKey, response);
  console.log("Cached GA4 data");

  return response;
}

module.exports = { getLLMResponse, fetchGA4Data };

//getLLMResponse("Give me insights on the page screen views from 365 days ago until yesterday?")

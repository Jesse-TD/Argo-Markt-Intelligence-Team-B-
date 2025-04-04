import OpenAI from "openai";

const creds = require('./openAi_creds.json')
const {BetaAnalyticsDataClient} = require('@google-analytics/data');
const ga4creds = require('./credentials.json')

const projectId = ga4creds.project_id;

const llm = new OpenAI({
    apiKey: creds.API_KEY
})

const agentTools = [{
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
}];

const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: ga4creds,  // Use credentials for authentication
    projectId: projectId       // Use project_id for authenticating the Google Cloud project
  });

async function getLLMResponse(user_query: string) {
    const streamResponse = await llm.chat.completions.create({
        model: 'gpt-4o-2024-11-20',
        messages: [
            {role: 'system', content: 'Some system prompt'},
            {role: 'user', content: user_query}
        ],
        stream: true
    })

    for await (const chunk of streamResponse){
        process.stdout.write(chunk.choices[0]?.delta?.content || "")
    }
}

async function fetchGA4Data(metric: any, dateRange: any) {
    const report = await analyticsDataClient.runRerport()
}
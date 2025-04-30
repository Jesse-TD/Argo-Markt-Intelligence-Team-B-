"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const llamaindex_1 = require("llamaindex");
const llamaindex_2 = require("llamaindex");
const openai_1 = require("@llamaindex/openai");
const agentTools_1 = require("./agentTools");
const openCreds = require("./openAi_creds.json");
class ArgoAgents {
    constructor() {
        this.llm = (0, openai_1.openai)({
            model: 'gpt-4o-2024-11-20',
            apiKey: openCreds.API_KEY
        });
        this.dashboardAgent = this.createDasboardAgent();
        this.acquisitionAgent = this.createAcquisitionAgent();
        this.engagementAgent = this.createEngagementAgent();
        this.fulfillmentAgent = this.createFulfillmentAgent();
        this.pageViewsAgent = this.createPageViewsAgent();
        this.agentWorkflow = (0, llamaindex_1.multiAgent)({
            agents: [
                this.dashboardAgent, 
                this.acquisitionAgent, 
                this.engagementAgent, 
                this.fulfillmentAgent, 
                this.pageViewsAgent
            ],
            rootAgent: this.dashboardAgent
        });
    }
    // classes that instantiate the agents needed for the workflow to run smoothly
    createDasboardAgent() {
        const systemPrompt = `You're ARGO's Dashboard Supervisor Agent. You oversee customer Acquisition, Engagement, Page Views, and Fulfillment. We are in April 2025.
            Interpret user queries and delegate tasks efficiently to specialized agents. Any request for pages shall be routed to the pageViewsAgent.
            Please, always delegate specific tasks to your other sub-agents.`;
        return (0, llamaindex_1.agent)({
            name: "dashboardAgent",
            systemPrompt: systemPrompt,
            llm: this.llm,
            tools: [agentTools_1.fetchDashboardInfoTool],
            canHandoffTo: ["acquisitionAgent", "engagementAgent", "fulfillmentAgent", "pageViewsAgent"]
        });
    }
    createAcquisitionAgent() {
        const agentPrompt = `
            You're the Acquisition Agent. Your task is analyzing customer acquisition data. We're in April 2025.
            Use a professional, yet approachable language style, avoiding overly technical jargon. Provide direct recommendations based on data-driven insights, structured into:
            - Observations: What the metrics explicitly indicate about user behavior. Include markdown-based tables if the data needs to be summarized.
            - Interpretations: Reasons behind observed user behaviors, such as low engagement or high bounce rates.
            - Actionable Recommendations: Concrete next steps.
            Prioritize concise yet informative responses. 
            Variable names you can use: 
            - screenPageViews
            - engagementRate 
            - newUsers
            - totalUsers
            - engagementTime. 
            Always suggest methods to simplify webpage content for improved scanability (short sentences, bullet points, straightforward language).
            Always utilize fetchGA4MetricSummaryTool for summarized data retrieval so you can provide insights. Be detailed. Should the data be too large, concatenate and summarize it for the user.
        `;
        return (0, llamaindex_1.agent)({
            name: "acquisitionAgent",
            systemPrompt: agentPrompt,
            llm: this.llm,
            tools: [agentTools_1.fetchGA4MetricSummaryTool]
        });
    }
    createEngagementAgent() {
        const systemPrompt = `
          You're the Engagement Agent. Analyze metrics related to customer engagement. We're in April 2025.
          Use a professional, yet approachable language style, avoiding overly technical jargon. Provide direct recommendations based on data-driven insights, structured into:
            - Observations: What the metrics explicitly indicate about user behavior. Include markdown-based tables if the data needs to be summarized.
            - Interpretations: Reasons behind observed user behaviors, such as low engagement or high bounce rates.
            - Actionable Recommendations: Concrete next steps.
          Variable names you can use: 
            - screenPageViews
            - engagementRate 
            - newUsers
            - totalUsers
            - engagementTime. 
          Always suggest methods to simplify webpage content for improved scanability (short sentences, bullet points, straightforward language).
          Always utilize fetchGA4MetricSummaryTool for summarized data retrieval so you can provide insights. Be detailed. Should the data be too large, concatenate and summarize it for the user.
        `;
        return (0, llamaindex_1.agent)({
            name: "engagementAgent",
            systemPrompt,
            llm: this.llm,
            tools: [agentTools_1.fetchGA4MetricSummaryTool]
        });
    }
    createFulfillmentAgent() {
        const systemPrompt = `
          You're the Fulfillment Agent. Provide analyses on fulfillment performance metrics. We're in April 2025.
          Use a professional, yet approachable language style, avoiding overly technical jargon. Provide direct recommendations based on data-driven insights, structured into:
            - Observations: What the metrics explicitly indicate about user behavior. Include markdown-based tables if the data needs to be summarized.
            - Interpretations: Reasons behind observed user behaviors, such as low engagement or high bounce rates.
            - Actionable Recommendations: Concrete next steps.
          Variable names you can use: 
            - screenPageViews
            - engagementRate 
            - newUsers
            - totalUsers
            - engagementTime. 
          Always suggest methods to simplify webpage content for improved scanability (short sentences, bullet points, straightforward language).
          Always utilize fetchGA4MetricSummaryTool for summarized data retrieval so you can provide insights. Be detailed. Should the data be too large, concatenate and summarize it for the user.
        `;
        return (0, llamaindex_1.agent)({
            name: "fulfillmentAgent",
            systemPrompt,
            llm: this.llm,
            tools: [agentTools_1.fetchGA4MetricSummaryTool]
        });
    }

    createPageViewsAgent(){
        const systemPrompt = `
          You're the Page Views Agent. Provide analysis on the most visited pages of the ARGO website. We're in April 2025.
          Use a professional, yet approachable language style, avoiding overly technical jargon. Provide direct recommendations based on data-driven insights, structured into:
            - Observations: What the metrics explicitly indicate about user behavior. Include markdown-based tables if the data needs to be summarized.
            - Interpretations: Reasons behind observed user behaviors, such as low engagement or high bounce rates.
            - Actionable Recommendations: Concrete next steps.
          Variable names you can use: 
            - averageSessionDuration (measures time per page/site)
            - screenPageViews (all the views of the pages/sites)
            - engagementRate  (the engagement rate per page/site)
            - newUsers (new users per page/site)
            - totalUsers (total users per page/site)
            - activeUsers (active users per page/site)
            - keyEvents per page/site
            - engagementTime per page/site
          Always suggest methods to simplify webpage content for improved scanability (short sentences, bullet points, straightforward language).
          Always utilize fetchGA4MetricSummaryTool for summarized data retrieval so you can provide insights. Be detailed. Should the data be too large, concatenate and summarize it for the user.
        `;
        return (0, llamaindex_1.agent)({
            name: "pageViewsAgent",
            systemPrompt,
            llm: this.llm,
            tools: [agentTools_1.fetchPageViewsTool]
        });
    }

    runWorkflow(input) {
        return this.agentWorkflow.run(input);
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const agentCollection = new ArgoAgents();
        const context = agentCollection.runWorkflow("What pages are users spending the most time on?");
        try {
            for (var _d = true, context_1 = __asyncValues(context), context_1_1; context_1_1 = yield context_1.next(), _a = context_1_1.done, !_a; _d = true) {
                _c = context_1_1.value;
                _d = false;
                const event = _c;
                // These events might be useful for UI
                if (event instanceof llamaindex_2.AgentToolCall ||
                    event instanceof llamaindex_2.AgentToolCallResult ||
                    event instanceof llamaindex_2.AgentOutput ||
                    event instanceof llamaindex_2.AgentInput ||
                    event instanceof llamaindex_2.StopEvent) {
                    console.log(event);
                }
                else if (event instanceof llamaindex_2.AgentStream) {
                    for (const chunk of event.data.delta) {
                        process.stdout.write(chunk);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = context_1.return)) yield _b.call(context_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
main();

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGA4MetricSummaryTool = exports.fetchPageViewsTool = exports.fetchDashboardInfoTool = void 0;
const llamaindex_1 = require("llamaindex");
const zod_1 = require("zod");
const ga4creds = require("./credentials.json");
const PROPERTY_ID = '324172901';
const projectId = ga4creds.project_id;
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: ga4creds,
    projectId: projectId
});
// universal function for data fethcing from GA4 API.
function fetchGA4Data(metric, startDate, endDate, dimensions, dimensionFilter) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqBody = {
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate, endDate }],
            metrics: [{ name: metric }],
        };

        if (dimensions) {
            reqBody.dimensions = Array.isArray(dimensions)
              ? dimensions.map((dim) => ({ name: dim }))
              : [{ name: dimensions }];
        }

        if(dimensionFilter){
            reqBody.dimensionFilter = {
                filter: {
                    fieldName: dimensionFilter.fieldName,
                    stringFilter: {
                      matchType: dimensionFilter.matchType,
                      value: dimensionFilter.value,
                    },
                },
            }
        }

        const [response] =  yield analyticsDataClient.runReport(reqBody)
        return response;
    });
}
exports.fetchDashboardInfoTool = (0, llamaindex_1.tool)({
    name: "dashboardTool",
    description: "Gets a general schema overview of the available charts on the ARGO marketing dashboard",
    parameters: zod_1.z.object({}),
    execute: () => {
        return [
            {
                report_group: "Customer Acquisition",
                charts: [
                    {
                        chart_name: "Engagement Rate",
                        metrics: [{ name: "engagementRate" }]
                    },
                    {
                        chart_name: "Page Views",
                        metrics: [{ name: "screenPageViews" }]
                    },
                    {
                        chart_name: "New vs Total Users",
                        metrics: [{ name: "newUsers" }, { name: "totalUsers" }]
                    },
                    {
                        chart_name: "Video Retention",
                        metrics: [{ name: "eventCount" }]
                    },
                    {
                        chart_name: "Engagement Time Watched",
                        metrics: [{ name: "userEngagementDuration" }]
                    }
                ]
            },
            {
                report_group: "Customer Engagement",
                charts: [
                    {
                        chart_name: "Engagement Rate",
                        metrics: [{ name: "engagementRate" }]
                    },
                    {
                        chart_name: "Page Views",
                        metrics: [{ name: "screenPageViews" }]
                    },
                    {
                        chart_name: "New vs Total Users",
                        metrics: [{ name: "newUsers" }, { name: "totalUsers" }]
                    },
                    {
                        chart_name: "Video Retention",
                        metrics: [{ name: "eventCount" }]
                    },
                    {
                        chart_name: "Engagement Time Watched",
                        metrics: [{ name: "userEngagementDuration" }]
                    }
                ]
            }
        ];
    }
});

exports.fetchPageViewsTool = (0, llamaindex_1.tool)({
    name: "pageViewsTool",
    description: "Gets the page views data in the ARGO marketing dashboard grouped by dimensions",
    parameters: zod_1.z.object({
        metric: zod_1.z.enum([
            "engagementRate",
            "activeUsers",
            "newUsers",
            "totalUsers",
            "keyEvents",
            "averageSessionDuration"
        ]),
        startDate: zod_1.z.string({
            description: "e.g. NdaysAgo, MM-DD-YYYY",
        }),
        endDate: zod_1.z.string({
            description: "e.g. yesterday, today",
        }),
        dimensions: zod_1.z.enum([
            "date",
            "day",
            "dayOfWeek",
            "month",
            "yearMonth",
            "pageTitle"
        ]).optional()
            .describe("Dimensions aggregate by. Note: 'pageTitle' is always called alongside other specified ones like 'day', 'month', etc/")
    }),
    execute: (_a) => __awaiter(void 0, [_a], void 0, function* ({ metric, startDate, endDate, dimensions }){
        const resp = yield fetchGA4Data(metric, startDate, endDate, dimensions);
        return getTopPages(resp)
    }),
});
exports.fetchGA4MetricSummaryTool = (0, llamaindex_1.tool)({
    name: "GA4MetricSummaryTool",
    description: "Fetch summarized GA4 analytics data based on specified metric and aggregation.",
    parameters: zod_1.z.object({
        metric: zod_1.z.enum([
            "screenPageViews",
            "engagementRate",
            "activeUsers",
            "newUsers",
            "totalUsers",
            "videoRetention",
            "engagementTimeWatched",
        ]),
        startDate: zod_1.z.string({ description: "Format: NdaysAgo, MM-DD-YYYY" }),
        endDate: zod_1.z.string({ description: "Format: yesterday, today, MM-DD-YYYY" }),
        dimensions: zod_1.z.enum([
            "date",
            "day",
            "dayOfWeek",
            "month",
            "yearMonth",
            "pageTitle"
        ]).optional()
          .describe("Dimensions to aggregate by! e.g., 'date', 'day', 'dayOfWeek', 'yearMonth', 'nthMinute'")
    }),
    execute: (_a) => __awaiter(void 0, [_a], void 0, function* ({ metric, startDate, endDate, dimensions}) {
        const response = yield fetchGA4Data(metric, startDate, endDate, dimensions);
        return simplifyGA4Data(response);
    }),
});
function simplifyGA4Data(response) {
    const rows = response.rows || [];
    return rows.map((row) => ({
        dimensions: row.dimensionValues.map((dim) => dim.value),
        metrics: row.metricValues.map((metric) => Number(metric.value)),
    }));
}

function getTopPages(response){
    return response.rows.slice(0,10).map((row) => ({
        dimensions: row.dimensionValues.map((dim) => dim.value),
        metrics: row.metricValues.map((metric) => Number(metric.value)),
    }));
}
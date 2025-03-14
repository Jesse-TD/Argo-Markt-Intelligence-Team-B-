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

// note that the stuff above comes from the transpiling of my TypeScript file and therefore it is kinda weird but works somehow
// I'll try implementing a sole .js program to avoid the unecessary lines over the transpile, but I only know Typescript :[

Object.defineProperty(exports, "__esModule", { value: true });
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const credentials = require('./credentials.json');
const PROPERTY_ID = '324172901';
const projectId = credentials.project_id;
const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: credentials,
    projectId: projectId
});

// home-main dashboard components
const mainDashboardQueries = {
    // data reflecting active users during the last week
    newVsActiveUsers: {
        dimensions:[{name:"date"}],
        metrics:[{name:"activeUsers"},
            {name:"keyEvents"},
            {name:"newUsers"},
            {name:"userEngagementDuration"}
        ],
        dateRanges:[{
            startDate:"7daysAgo",
            endDate:"yesterday"}
        ],
        orderBys:[{
            metric:{metricName:"activeUsers"},
            desc:true
        }], 
        metricAggregations:["TOTAL"]
    },

    //active users in the past half hour, will have to filter this into a better time window though
    past30minutes: {
        dimensions:[{name:"country"},{name:"dateHourMinute"}],
        metrics:[{name:"activeUsers"}],
        dateRanges:[{
            startDate:"today",
            endDate:"today"}
        ],
        orderBys:[{
            metric:{metricName:"activeUsers"},
            desc:true
        }],
        metricAggregations:["TOTAL"]
    },

    // demographic details: Country
    activeByCountryId: {
        dimensions:[{name:"country"}],
        metrics:[{name:"activeUsers"},
            {name:"engagedSessions"},
            {name:"engagementRate"},
            {name:"eventCount"},
            {name:"newUsers"},
            {name:"totalRevenue"},
            {name:"userKeyEventRate"}
        ],
        dateRanges:[{
            startDate:"28daysAgo",
            endDate:"yesterday"
        }],
        orderBys:[{
            metric:{metricName:"activeUsers"}
        }],
        metricAggregations:["TOTAL"]}
}

//collection of user/customer acquisition Queries to run as batch
const acquisitionQueries = {
    // user acquisition
    primaryChannelGroup_newUsers: {
        dimensions: [{name: "firstUserPrimaryChannelGroup" }],
        metrics: [{ name: "engagementRate" }, 
            { name: "eventCount" }, 
            { name: "keyEvents" }, 
            { name: "newUsers" }, 
            { name: "totalUsers" }
        ],
        dateRanges: [{ 
            startDate: "28daysAgo", 
            endDate: "yesterday" 
        }],
        orderBys: [{
                dimension: {
                    orderType: "CASE_INSENSITIVE_ALPHANUMERIC", 
                    dimensionName: "firstUserPrimaryChannelGroup"
                }
        }]
    },
    // traffic acquisition
    primaryChannelGroup_sessions: {
        dimensions: [{ name: "sessionPrimaryChannelGroup" }],
        metrics: [{ name: "averageSessionDuration" }, 
            { name: "engagedSessions" }, 
            { name: "engagementRate" }, 
            { name: "eventCount" }, 
            { name: "keyEvents" }, 
            { name: "sessionKeyEventRate" }, 
            { name: "totalRevenue" }
        ],
        dateRanges: [{ 
            startDate: "28daysAgo", 
            endDate: "yesterday" 
        }],
        orderBys: [{
                dimension: {
                    orderType: "ALPHANUMERIC", dimensionName: "sessionPrimaryChannelGroup"
                }
            }]
    }
};
// collection of user/customer engagement queries to run as batch
const engagementQueries = {
    // events: event name
    eventNameOverTime: {
        dateRanges: [{ 
            startDate: "28daysAgo", 
            endDate: "yesterday" 
        }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }, 
                  { name: "eventCountPerUser" }, 
                  { name: "totalRevenue" }, 
                  { name: "totalUsers" }],
        orderBys: [{
                metric: {
                    metricName: "eventCount"
                }
            }]
    },
    // pages and screens: path and class
    pagesAndScreens: {
        dateRanges: [{ 
            startDate: "28daysAgo", 
            endDate: "yesterday" 
        }],
        dimensions: [{name: "unifiedPagePathScreen" }],
        metrics: [{ name: "activeUsers" }, 
            { name: "eventCount" }, 
            { name: "keyEvents" }, 
            { name: "screenPageViews" }, 
            { name: "screenPageViewsPerUser" }, 
            { name: "userEngagementDuration" 
        }],
        orderBys: [{
                metric: {
                    metricName: "screenPageViews"
                },
                desc: true
            }]
    },
    // landing page
    landingPage: {
        dateRanges: [{ 
            startDate: "28daysAgo", 
            endDate: "yesterday" 
        }],
        dimensions: [{ name: "landingPage" }],
        metrics: [{ name: "activeUsers" }, 
            { name: "keyEvents" }, 
            { name: "newUsers" }, 
            { name: "sessionKeyEventRate" }, 
            { name: "sessions" }, 
            { name: "userEngagementDuration" 
        }],
        orderBys: [
            { metric: { metricName: "sessions" },
                desc: true
            }
        ]
    }
};

// FULFILLMENT QUERIES
const fulfillmentQueries = {
    // Fulfillment Page Metrics
    fulfillmentPage: { // Need to filter specifically for webpage "Omni Fulfillment"
        dimensions: [
            { name: "month"},
            { name: "pageTitle" }
        ],
        metrics: [
            { name: "engagementRate"},
            { name: "userEngagementDuration"},
            { name: "newUsers"},
            { name: "totalUsers"},
            { name: "screenPageViews"}
        ],
        dateRanges: [{ // Present that last years worth of data sorted by month
            startDate: "365daysAgo",
            endDate: "yesterday"
        }]
    },

    fulfillmentVideo: { // video total time is 5:16
        // Query provides data in terms how how many users get to each percentage interval
        // To replace % with timestamp math must be done where 100% = 5:16
        dimensions: [
            {name: "videoTitle"},
            {name: "customEvent:video_percent"}
        ],
        metrics: [
            {name: "eventCount"}
        ],
        dateRanges: [{
            startDate: "30daysAgo",
            endDate: "yesterday"
        }]
    }
};

// RISK MANAGEMENT QUERIES
const riskQueries = {
    riskPageMetrics: {
        dimensions: [{ name: "month" }, { name: "pageTitle" }],
        metrics: [
            { name: "activeUsers" },
            { name: "newUsers" },
            { name: "engagementRate" },
            { name: "userEngagementDuration" },
            { name: "bounceRate" }
        ],
        dateRanges: [{ startDate: "365daysAgo", endDate: "yesterday" }],
        orderBys: [{ metric: { metricName: "activeUsers" } }]
    },
    riskVideoRetention: {
        dimensions: [
            { name: "videoTitle" },
            { name: "customEvent:video_percent" }
        ],
        metrics: [{ name: "eventCount" }],
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }]
    }
};

// SALES MANAGEMENT QUERIES
const salesQueries = {
    salesPageMetrics: {
        dimensions: [{ name: "month" }, { name: "pageTitle" }],
        metrics: [
            { name: "activeUsers" },
            { name: "newUsers" },
            { name: "screenPageViews" },
            { name: "userEngagementDuration" }
        ],
        dateRanges: [{ startDate: "365daysAgo", endDate: "yesterday" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }]
    },
    salesVideoRetention: {
        dimensions: [
            { name: "videoTitle" },
            { name: "customEvent:video_percent" }
        ],
        metrics: [{ name: "eventCount" }],
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }]
    }
};

function runMainDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // note that the batch is provided as an array of RunReportResponse
            const [mainDashBatch] = yield analyticsDataClient.batchRunReports({
                property: `properties/${PROPERTY_ID}`,
                requests: Object.values(mainDashboardQueries)
            });
            const results = mainDashBatch;

            // tool to iterate and print the response's body
            mainDashBatch.reports.forEach((report, index) => {
                console.log(`Report ${index + 1}:`);
                // headers
                const dimensionHeaders = report.dimensionHeaders.map((header) => header.name);
                console.log('Dimensions:', dimensionHeaders);
                // contents per header
                const metricHeaders = report.metricHeaders.map((header) => header.name);
                console.log('Metrics:', metricHeaders);
                // prints header: content[]
                report.rows.forEach((row) => {
                    // dimensions
                    const dimensions = row.dimensionValues.map((dv) => dv.value);
                    console.log('Dimension Values:', dimensions);
                    // the actual important data
                    const metrics = row.metricValues.map(mv => mv.value);
                    console.log('Metric Values:', metrics);
                });
            });

            return results;
        }
        catch (err) {
            // failure to catch a response from the GA4 API
            console.error(`GA4 Data API error: ${err}`);
            return [];
        }
    });
}

function runAcquisitionBatch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // note that the batch is provided as an array of RunReportResponse
            const [acqResponseBatch] = yield analyticsDataClient.batchRunReports({
                property: `properties/${PROPERTY_ID}`,
                requests: Object.values(acquisitionQueries)
            });
            const results = acqResponseBatch;

            // tool to iterate and print the response's body
            acqResponseBatch.reports.forEach((report, index) => {
                console.log(`Report ${index + 1}:`);
                // headers
                const dimensionHeaders = report.dimensionHeaders.map((header) => header.name);
                console.log('Dimensions:', dimensionHeaders);
                // contents per header
                const metricHeaders = report.metricHeaders.map((header) => header.name);
                console.log('Metrics:', metricHeaders);
                // prints header: content[]
                report.rows.forEach((row) => {
                    // dimensions
                    const dimensions = row.dimensionValues.map((dv) => dv.value);
                    console.log('Dimension Values:', dimensions);
                    // the actual important data
                    const metrics = row.metricValues.map(mv => mv.value);
                    console.log('Metric Values:', metrics);
                });
            });

            return results;
        }
        catch (err) {
            // failure to catch a response from the GA4 API
            console.error(`GA4 Data API error: ${err}`);
            return [];
        }
    });
}
function runEngagementBatch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // note that the batch is provided as an array of RunReportResponse
            const [engResponseBatch] = yield analyticsDataClient.batchRunReports({
                property: `properties/${PROPERTY_ID}`,
                requests: Object.values(engagementQueries)
            });
            const results = engResponseBatch;

            // tool to iterate over the response's body {Response, Response}
            engResponseBatch.reports.forEach((report, index) => {
                console.log(`Report ${index + 1}:`);
                // headers
                const dimensionHeaders = report.dimensionHeaders.map((header) => header.name);
                console.log('Dimensions:', dimensionHeaders);
                // contents per header
                const metricHeaders = report.metricHeaders.map((header) => header.name);
                console.log('Metrics:', metricHeaders);
                // prints header: content[]
                report.rows.forEach((row) => {
                    // dimensions
                    const dimensions = row.dimensionValues.map((dv) => dv.value);
                    console.log('Dimension Values:', dimensions);
                    // the actual important data
                    const metrics = row.metricValues.map(mv => mv.value);
                    console.log('Metric Values:', metrics);
                });
            });

            return results;
        }
        catch (err) {
            // failure to catch a response from the GA4 API
            console.error(`GA4 Data API error: ${err}`);
            return [];
        }
    });

    function runFulfillmentBatch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [fulfillmentResponseBatch] = yield analyticsDataClient.batchRunReports({
                    property: `properties/${PROPERTY_ID}`,
                    requests: Object.values(fulfillmentQueries)
                });
                fulfillmentResponseBatch.reports.forEach((report, index) => {
                    console.log(`Fulfillment Report ${index + 1}:`);
                    const dimensionHeaders = report.dimensionHeaders.map(header => header.name);
                    console.log('Dimensions:', dimensionHeaders);
                    const metricHeaders = report.metricHeaders.map(header => header.name);
                    console.log('Metrics:', metricHeaders);
                    report.rows.forEach(row => {
                        const dimensions = row.dimensionValues.map(dv => dv.value);
                        console.log('Dimension Values:', dimensions);
                        const metrics = row.metricValues.map(mv => mv.value);
                        console.log('Metric Values:', metrics);
                    });
                });
                return fulfillmentResponseBatch;
            } catch (err) {
                console.error(`GA4 Data API error: ${err}`);
                return [];
            }
        });
    }
}

function runRiskBatch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [riskResponseBatch] = yield analyticsDataClient.batchRunReports({
                property: `properties/${PROPERTY_ID}`,
                requests: Object.values(riskQueries)
            });
            const results = riskResponseBatch;

            riskResponseBatch.reports.forEach((report, index) => {
                console.log(`Risk Report ${index + 1}:`);
                const dimensionHeaders = report.dimensionHeaders.map((header) => header.name);
                console.log('Dimensions:', dimensionHeaders);
                const metricHeaders = report.metricHeaders.map((header) => header.name);
                console.log('Metrics:', metricHeaders);
                report.rows.forEach((row) => {
                    const dimensions = row.dimensionValues.map((dv) => dv.value);
                    console.log('Dimension Values:', dimensions);
                    const metrics = row.metricValues.map((mv) => mv.value);
                    console.log('Metric Values:', metrics);
                });
            });

            return results;
        } catch (err) {
            console.error(`GA4 Data API error (Risk Report): ${err}`);
            return [];
        }
    });
}


function runSalesBatch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [salesResponseBatch] = yield analyticsDataClient.batchRunReports({
                property: `properties/${PROPERTY_ID}`,
                requests: Object.values(salesQueries)
            });
            const results = salesResponseBatch;

            salesResponseBatch.reports.forEach((report, index) => {
                console.log(`Sales Report ${index + 1}:`);
                const dimensionHeaders = report.dimensionHeaders.map((header) => header.name);
                console.log('Dimensions:', dimensionHeaders);
                const metricHeaders = report.metricHeaders.map((header) => header.name);
                console.log('Metrics:', metricHeaders);
                report.rows.forEach((row) => {
                    const dimensions = row.dimensionValues.map((dv) => dv.value);
                    console.log('Dimension Values:', dimensions);
                    const metrics = row.metricValues.map((mv) => mv.value);
                    console.log('Metric Values:', metrics);
                });
            });

            return results;
        } catch (err) {
            console.error(`GA4 Data API error (Sales Report): ${err}`);
            return [];
        }
    });
}


// runAcquisitionBatch()
// runEngagementBatch()
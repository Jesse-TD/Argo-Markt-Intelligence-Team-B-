// QueryManager.js

const {BetaAnalyticsDataClient} = require('@google-analytics/data');
const path = require('path');

// Initialize client with credentials from json file
const credentials = require('./credentials.json');
const propertyId = credentials.project_id;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: credentials,
  projectId: propertyId
});

// Customer Acquisition Total & New Users
async function runReport() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '365daysAgo',
          endDate: 'yesterday',
        },
      ],
      dimensions: [
        {
          name: 'month',
        },
      ],
      metrics: [
        {
          name: 'newUsers',
        },
        {
          name: 'totalUsers'
        }
      ],
      metricAggregations: [
        'TOTAL'
      ]
    });

    // Process the results and ensure we return an array
    if (!response.rows) {
      return [];
    }

    const results = response.rows.map((row) => ({
      month: row.dimensionValues[0].value,
      newUsers: parseInt(row.metricValues[0].value) || 0,
      totalUsers: parseInt(row.metricValues[1].value) || 0
    }));

    // Add totals if available
    if (response.metricAggregateTotals) {
      results.push({
        month: 'TOTAL',
        newUsers: parseInt(response.metricAggregateTotals[0]) || 0,
        totalUsers: parseInt(response.metricAggregateTotals[1]) || 0
      });
    }

    return results;
  } catch (err) {
    console.error('GA4 Data API error:', err);
    return []; // Return empty array instead of throwing error
  }
}

module.exports = {
  runReport
};

// QueryManager.js

const {BetaAnalyticsDataClient} = require('@google-analytics/data');
const path = require('path');

// Initialize client with credentials from json file
const credentials = require('./credentials.json');
// Use the actual numeric GA4 Property ID (not project_id from credentials)
const propertyId = '324172901'; // Replace this with your numeric GA4 Property ID
const projectId = credentials.project_id; // Use this for the Google Cloud project ID

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: credentials,  // Use credentials for authentication
  projectId: projectId       // Use project_id for authenticating the Google Cloud project
});

// Customer Acquisition Total & New Users
async function runNewVsTrueUserReport() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,  // Correct use of GA4 numeric Property ID here
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
  runNewVsTrueUserReport
};

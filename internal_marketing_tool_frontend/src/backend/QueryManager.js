// QueryManager.js

// 1. Import the Google Analytics Data API client library
const {BetaAnalyticsDataClient} = require('@google-analytics/data');
const path = require('path');

// 2. Initialize a client with your service account credentials
//    Option A: Provide the path to your JSON key file
//    Option B: Use environment variables or a credentials object
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: path.join(__dirname, 'PATH_TO_YOUR_SERVICE_ACCOUNT.json'),
  // or credentials: {
  //   client_email: '...',
  //   private_key: '...',
  // }
});


// Customer Acquisition Total & New Users
async function runReport() {
  try {
    // 3. Construct the request object
    const [response] = await analyticsDataClient.runReport({
      property: `properties/YOUR_PROPERTY_ID`, // e.g. properties/123456789
      dateRanges: [
        {
            startDate: '365daysAgo',
            endDate: 'yesteday',
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

    // 4. Output the results
    console.log('Report result:');
    response.rows.forEach((row) => {
      const newUsers = row.metricValues[0].value;
      const totalUsers = row.metricValues[1].value;
      console.log(`Total Users: ${totalUsers}, New Users: ${newUsers}`);
    });
  } catch (err) {
    console.error('GA4 Data API error:', err);
  }
}

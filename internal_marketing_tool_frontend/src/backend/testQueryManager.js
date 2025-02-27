const { runNewVsTrueUserReport } = require('./QueryManager');

async function test() {
  try {
    const data = await runNewVsTrueUserReport();
    console.log("GA4 Report Data:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();

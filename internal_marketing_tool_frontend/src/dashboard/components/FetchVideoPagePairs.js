import { useEffect } from "react";
import axios from "axios";

const FetchVideoPagePairs = () => {
  useEffect(() => {
    const videoTitles = [
      "Delivering Service Excellence",
      "Omni Fulfillment",
      "Safe and Sound Risk Mitigation",
      "Customer Engagement"
    ];

    const pageTitles = [
      "Customer Acquisition",
      "Connects Customer Engagement - ARGO Data",
      "Customer Experience - ARGO Data",
      "Connects Omni Fulfillment - ARGO Data"
    ];

    const start = "30daysAgo";
    const end = "yesterday";

    const videoReports = [];
    const pageReports = [];

    const fetchData = async () => {
      for (let i = 0; i < videoTitles.length; i++) {
        const videoTitle = videoTitles[i].trim();
        const pageTitle = pageTitles[i].trim();

        console.log(`Fetching pair ${i + 1}: Page: "${pageTitle}", Video: "${videoTitle}"`);

        try {
          const res = await axios.get("http://localhost:5000/api/dynamic-report", {
            params: { videoTitle, pageTitle, start, end }
          });

          if (res.data?.length > 0) {
            const [pageData, videoData] = res.data;

            console.log("✅ Raw Response:", res.data);
            console.log("🧪 Page Rows:", pageData?.rows);
            console.log("🧪 Video Rows:", videoData?.rows);

            if (pageData?.rows?.length) {
              pageReports.push({ title: pageTitle, data: pageData });
            }

            if (videoData?.rows?.length) {
              videoReports.push({ title: videoTitle, data: videoData });
            }
          } else {
            console.warn(`No data returned for pair ${i + 1}`);
          }
        } catch (err) {
          console.error(`❌ Error fetching pair ${i + 1}:`, err.message);
        }
      }

      console.log("📄 Page Reports:", pageReports);
      console.log("🎥 Video Reports:", videoReports);
    };

    fetchData();
  }, []);

  return null;
};

export default FetchVideoPagePairs;
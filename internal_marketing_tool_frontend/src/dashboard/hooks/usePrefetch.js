import { useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to prefetch data for faster loading experience
 */
export const usePrefetch = () => {
  useEffect(() => {
    // Prefetch dashboard data
    const prefetchDashboard = async () => {
      try {
        console.log("Prefetching dashboard data...");
        await axios.get("http://localhost:5001/api/main-dashboard?start=7daysAgo&end=yesterday");
        console.log("Dashboard data prefetched");
      } catch (error) {
        console.warn("Failed to prefetch dashboard data", error);
      }
    };

    // Prefetch reports data with default date range
    const prefetchReports = async () => {
      try {
        console.log("Prefetching reports data...");
        await axios.get("http://localhost:5001/api/all-dynamic-reports");
        console.log("Reports data prefetched");
      } catch (error) {
        console.warn("Failed to prefetch reports data", error);
      }
    };

    // Start prefetching with a slight delay to not block initial render
    const prefetchTimer = setTimeout(() => {
      prefetchDashboard();
      prefetchReports();
    }, 1000);

    return () => {
      clearTimeout(prefetchTimer);
    };
  }, []);
}; 
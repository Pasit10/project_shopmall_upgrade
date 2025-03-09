import { useState, useEffect } from "react";
import axiosInstant from "../utils/axios";
import Stats from "../Types/Stats"
const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstant.post<Stats>(
          "/getAllStats",
          {},
          { withCredentials: true }
        );
        if (response.status === 200) {
          setStats({
            totalUsers: response.data.totalUsers || 0,
            products: response.data.products || 0,
            orders: response.data.orders || 0,
            revenue: response.data.revenue || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return stats;
};

export default useStats;

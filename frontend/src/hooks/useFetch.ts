import { useState, useEffect } from "react";
import apiClient from "../services/apiClient";

const useFetch = (endpoint: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(endpoint);
        setData(response.data);
      } catch (error) {
        console.error("error while fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading };
};

export default useFetch;

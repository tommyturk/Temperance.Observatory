import axios from "../../services/axiosInstance";

export const backfillHistoricalPrices = async (symbol, interval) => {
  try {
    const response = await axios.get(`/api/backfill/backfillSecurity?symbol=${symbol}&interval=${interval}`);
    console.log("Backfill Response: ", response);
    console.log("Backfill Data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error triggering backfill for historical prices:", error);
    return null;
  }
};
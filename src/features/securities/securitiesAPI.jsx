import axios from "../../services/axiosInstance";

export const getAllSecurities = async () => {
    try {
        const response = await axios.get("/api/securities");
        return response;
    } catch (error) {
        console.error("Error fetching securities:", error);
        return [];
    }
};

export const searchSecurity = async (query) => {
    try {
        const response = await axios.get(`/api/securities/search?query=${query}`);
        console.log("data: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching security:", error);
        return null;
    }
};

export const getSecurityOverview = async (symbol) => {
    try {
        const response = await axios.get(`/api/securities/overview?symbol=${symbol}`);
        console.log("Response: ", response);
        console.log("data: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching security:", error);
        return null;
    }
};

export const getSecurityEarnings = async (query) => {
    try {
        const response = await axios.get(`/api/securities/earnings?query=${query}`);
        console.log("Earnings Response: ", response);
        console.log("Earnings data: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error searching security:", error);
        return null;
    }
};

export const getSecuritiesBalanceSheet = async (query) => {
    try{
        const response = await axios.get(`/api/securities/balanceSheet?query=${query}`);
        console.log("Balance Sheet Response: ", response);
        console.log("Balance Sheet data: ", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error searching security:", error);
        return null;
    }
};

export const checkSecurityPrices = async (symbol, interval) => {
    try{
        const response = await axios.get(`/api/securities/checkPrices?symbol=${symbol}&interval=${interval}`);
        console.log("Check Prices Response: ", response);
        console.log("Check Prices data: ", response.data);
        return response.data;
    }
    catch(error){
        console.error("Error searching security:", error);
        return null;
    }
};

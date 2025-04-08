import React, { useEffect, useState } from "react";
import { getSecuritiesBalanceSheet } from "./securitiesAPI";
import { Tooltip } from "react-tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

const BalanceSheet = ({ symbol }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState("annual");

    useEffect(() => {
        setIsLoading(true);
        getSecuritiesBalanceSheet(symbol)
            .then((response) => {
                setData(response.data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [symbol]);

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!data) {
        return <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md text-white">No data available</div>;
    }

    const { annualReports, quarterlyReports } = data;
    console.log("Annual Reports: ", annualReports);
    console.log("Quarterly Reports: ", quarterlyReports);
    const quarterlyGraphData = quarterlyReports?.map((report) => ({
        name: report.fiscalDateEnding,
        totalAssets: report.totalAssets / 1e9,
        totalLiabilities: report.totalLiabilities / 1e9,
        ShareholderEquity: report.totalShareholderEquity / 1e9,
    })).reverse();

    return (
        <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-white">{data.symbol || "N/A"} Balance Sheet</h2>

            <div className="mt-4 flex space-x-4">
                <button
                    onClick={() => setViewMode("annual")}
                    className={`px-4 py-2 rounded-lg ${
                        viewMode === "annual" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400"
                    }`}
                >
                    Annual
                </button>
                <button
                    onClick={() => setViewMode("quarterly")}
                    className={`px-4 py-2 rounded-lg ${
                        viewMode === "quarterly" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400"
                    }`}
                >
                    Quarterly
                </button>
            </div>

            {/* Annual Data */}
            {viewMode === "annual" && annualReports?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold text-white">Annual Reports</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {annualReports.map((report, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-lg font-semibold text-gray-200">{report.fiscalDateEnding}</p>
                                <p className="text-sm text-gray-400">Total Assets: ${(report.totalAssets / 1e9)?.toFixed(2)}B</p>
                                <p className="text-sm text-gray-400">Total Liabilities: ${(report.totalLiabilities / 1e9)?.toFixed(2)}B</p>
                                <p className="text-sm text-gray-400">Shareholder Equity: ${(report.totalShareholderEquity / 1e9)?.toFixed(2)}B</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quarterly Data */}
            {viewMode === "quarterly" && quarterlyReports?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold text-white">Quarterly Reports</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quarterlyReports.map((report, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-lg font-semibold text-gray-200">{report.fiscalDateEnding}</p>
                                <p className="text-sm text-gray-400">Total Assets: ${(report.totalAssets / 1e9)?.toFixed(2)}B</p>
                                <p className="text-sm text-gray-400">Total Liabilities: ${(report.totalLiabilities / 1e9)?.toFixed(2)}B</p>
                                <p className="text-sm text-gray-400">Shareholder Equity: ${(report.totalShareholderEquity / 1e9)?.toFixed(2)}B</p>
                            </div>
                        ))}
                    </div>

                    {/* Quarterly Graph */}
                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-white">Quarterly Trends</h3>
                        <div className="mt-4 h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={quarterlyGraphData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                                        labelStyle={{ color: "#D1D5DB" }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="totalAssets" stroke="#10B981" name="Total Assets (B)" />
                                    <Line type="monotone" dataKey="totalLiabilities" stroke="#EF4444" name="Total Liabilities (B)" />
                                    <Line type="monotone" dataKey="ShareholderEquity" stroke="#3B82F6" name="Shareholder Equity (B)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            <Tooltip id="balance-sheet-tooltip" />
        </div>
    );
};

export default BalanceSheet;
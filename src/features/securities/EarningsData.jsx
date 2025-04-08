import React, { useEffect, useState } from "react";
import { getSecurityEarnings } from "./securitiesAPI";

const EarningsData = ({ symbol }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getSecurityEarnings(symbol).then((response) => {
            setData(response.data);
            setIsLoading(false);
        });
    }, [symbol]);

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!data || (!data.annual?.length && !data.quarterly?.length)) {
        return (
            <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md text-white">
                No earnings data available
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-white">{data.symbol} Earnings</h2>

            {/* Latest Quarterly Earnings */}
            {data.quarterly?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl text-yellow-300 font-semibold">Latest Quarterly Earnings</h3>
                    <div className="flex justify-between items-center">

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.quarterly
                            .sort((a, b) => new Date(b.fiscalDateEnding) - new Date(a.fiscalDateEnding))
                            .slice(0, 3)
                            .map((q, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                                    <p className="text-lg font-semibold text-gray-200">Fiscal Date</p>
                                    <p className="text-2xl text-green-400">{q.fiscalDateEnding?.split("T")[0]}</p>
                                    <p className="text-lg font-semibold text-gray-200">Reported EPS</p>
                                    <p className="text-2xl text-blue-400">{q.reportedEPS ?? "N/A"}</p>
                                    <p className="text-lg font-semibold text-gray-200">Estimated EPS</p>
                                    <p className="text-2xl text-orange-400">{q.estimatedEPS ?? "N/A"}</p>
                                    <p className="text-lg font-semibold text-gray-200">Surprise</p>
                                    <p className="text-2xl text-purple-400">{q.surprise ?? "N/A"}</p>
                                    <p className="text-lg font-semibold text-gray-200">Surprise Percentage</p>
                                    <p className="text-2xl text-red-400">{q.surprisePercentage ? `${q.surprisePercentage.toFixed(2)}%` : "N/A"}</p>
                                    <p className="text-lg font-semibold text-gray-200">Report Time</p>
                                    <p className="text-2xl text-yellow-400">{q.reportTime}</p>
                                </div>
                            ))}
                            </div>
                        </div>
                </div>
            )}

            {/* Latest Annual Earnings */}
            {data.annual?.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl text-yellow-300 font-semibold">Latest Annual Earnings</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.annual
                            .sort((a, b) => new Date(b.fiscalDateEnding) - new Date(a.fiscalDateEnding))
                            .slice(0, 3)
                            .map((a, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                                    <p className="text-lg font-semibold text-gray-200">Fiscal Date</p>
                                    <p className="text-2xl text-green-400">{a.fiscalDateEnding?.split("T")[0]}</p>
                                    <p className="text-lg font-semibold text-gray-200">Reported EPS</p>
                                    <p className="text-2xl text-blue-400">{a.reportedEPS ?? "N/A"}</p>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EarningsData;

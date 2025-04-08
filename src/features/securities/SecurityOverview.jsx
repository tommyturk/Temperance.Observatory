// SecurityOverview.jsx
import React, { useEffect, useState } from "react";
import { getSecurityOverview } from "./securitiesAPI";
import { Tooltip } from 'react-tooltip';

const SecurityOverview = ({ symbol }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getSecurityOverview(symbol).then((response) => {
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

    if (!data) {
        return <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md text-white">No data available</div>;
    }

    return (
        <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-white">{data.name} ({data.symbol})</h2>
            <p className="text-sm text-gray-400 mt-1">{data.description}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                    <p className="text-lg font-semibold text-gray-200">Market Cap</p>
                    <p className="text-2xl text-green-400">${(data.marketCapitalization / 1e9)?.toFixed(2)}B</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                    <p className="text-lg font-semibold text-gray-200">PE Ratio</p>
                    <p className="text-2xl text-blue-400">{data.peRatio?.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                    <p className="text-lg font-semibold text-gray-200">EPS</p>
                    <p className="text-2xl text-purple-400">${data.eps?.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                    <p className="text-lg font-semibold text-gray-200">Revenue (TTM)</p>
                    <p className="text-2xl text-yellow-400">${(data.revenueTTM / 1e9)?.toFixed(2)}B</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                    <p className="text-lg font-semibold text-gray-200">Profit Margin</p>
                    <p className="text-2xl text-pink-400">{(data.profitMargin * 100)?.toFixed(2)}%</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                    <p className="text-lg font-semibold text-gray-200">Dividend Yield</p>
                    <p className="text-2xl text-indigo-400">{data.dividendYield}%</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                    <p className="text-lg font-semibold text-gray-200">Analyst Target Price</p>
                    <p className="text-2xl text-teal-400">${data.analystTargetPrice}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                    <p className="text-lg font-semibold text-gray-200">Beta</p>
                    <p className="text-2xl text-orange-400">{data.beta}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105">
                    <p className="text-lg font-semibold text-gray-200">Shares Outstanding</p>
                    <p className="text-2xl text-red-400">{(data.sharesOutstanding / 1e9)?.toFixed(2)}B</p>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="text-xl font-bold text-white">Analyst Ratings</h3>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-gray-200">Strong Buy</p>
                        <p className="text-2xl text-green-400">{data.analystRatingStrongBuy}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-gray-200">Buy</p>
                        <p className="text-2xl text-blue-400">{data.analystRatingBuy}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-gray-200">Hold</p>
                        <p className="text-2xl text-yellow-400">{data.analystRatingHold}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-gray-200">Sell</p>
                        <p className="text-2xl text-red-400">{data.analystRatingSell}</p>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="text-xl font-bold text-white">Key Metrics</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-gray-200">PEG Ratio</p>
                        <p className="text-2xl text-purple-400">{data.pegRatio?.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-gray-200">Price to Book</p>
                        <p className="text-2xl text-indigo-400">{data.priceToBookRatio?.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-gray-200">EV to EBITDA</p>
                        <p className="text-2xl text-teal-400">{data.evToEBITDA?.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <Tooltip id="security-tooltip" />
        </div>
    );
};

export default SecurityOverview;
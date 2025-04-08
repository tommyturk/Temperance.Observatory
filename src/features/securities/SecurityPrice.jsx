import React, { useEffect, useState } from "react";
import { useSignalR } from "../../context/SignalRContext";
import { checkSecurityPrices } from "./securitiesAPI";
import { backfillHistoricalPrices } from "../backtesting/backtestAPI";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

const SecurityPrice = ({ symbol }) => {
    const { addListener, removeListener, invoke, connectionState } = useSignalR();
    const [priceData, setPriceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("1min");
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());
    const [showBackfillModal, setShowBackfillModal] = useState(false);
    const [backfillLogs, setBackfillLogs] = useState([]);

    useEffect(() => {
        const handleStatusUpdate = (message) => {
            if (message.symbol === symbol) {
                setBackfillLogs(prev => [...prev, message]);
            }
        };

        let retryTimeout;
        let isMounted = true;

        const joinGroup = async (attempt = 1) => {
            try {
                if (!isMounted) return;
                
                if (connectionState === 'connected') {
                    await invoke("JoinGroup", symbol);
                    console.log("Successfully joined group:", symbol);
                } else {
                    console.warn("Connection not ready - retrying in 2 seconds");
                    retryTimeout = setTimeout(() => joinGroup(attempt + 1), 2000);
                }
            } catch (error) {
                console.error(`JoinGroup failed (attempt ${attempt}):`, error);
                retryTimeout = setTimeout(() => joinGroup(attempt + 1), Math.min(2000 * attempt, 10000));
            }
        };

        const leaveGroup = async () => {
            try {
                if (connectionState === 'connected') {
                    await invoke("LeaveGroup", symbol);
                    console.log("Successfully left group:", symbol);
                }
            } catch (error) {
                console.error("Error leaving group:", error);
            }
        };

        // Add listener and join group
        addListener("ReceiveStatusUpdate", handleStatusUpdate);
        joinGroup();

        // Cleanup
        return () => {
            isMounted = false;
            clearTimeout(retryTimeout);
            removeListener("ReceiveStatusUpdate", handleStatusUpdate);
            leaveGroup();
        };
    }, [symbol, connectionState, addListener, removeListener, invoke]);

    useEffect(() => {
        checkAndFetchPrices();
    }, [symbol, timeRange, startDate, endDate]);

    const checkAndFetchPrices = async () => {
        setIsLoading(true);
        try {
            const response = await checkSecurityPrices(symbol, timeRange);
            if (response.data === false) {
                setShowBackfillModal(true);
                return;
            }
            setPriceData(response.data);
        } catch (error) {
            console.error("Error checking prices:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackfillConfirmation = async () => {
        setShowBackfillModal(false);
        setIsLoading(true);
        setBackfillLogs([]);
        try {
            await backfillHistoricalPrices(symbol, timeRange);
        } catch (error) {
            console.error("Backfill error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    const handleDateRangeChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-white">{symbol || "N/A"} Historical Prices</h2>

            {/* Time Range Selector */}
            <div className="mt-4 flex space-x-4">
                <button
                    onClick={() => handleTimeRangeChange("1min")}
                    className={`px-4 py-2 rounded-lg ${timeRange === "1min" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400"}`}
                >
                    1 min
                </button>
                <button
                    onClick={() => handleTimeRangeChange("15min")}
                    className={`px-4 py-2 rounded-lg ${timeRange === "15min" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400"}`}
                >
                    15 min
                </button>
                <button
                    onClick={() => handleTimeRangeChange("30min")}
                    className={`px-4 py-2 rounded-lg ${timeRange === "30min" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400"}`}
                >
                    30 min
                </button>
                <button
                    onClick={() => handleTimeRangeChange("60min")}
                    className={`px-4 py-2 rounded-lg ${timeRange === "60min" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400"}`}
                >
                    60 min
                </button>
            </div>

            {/* Custom Date Range Picker */}
            <div className="mt-4">
                <label className="text-gray-200">Custom Date Range:</label>
                <DatePicker
                    selected={startDate}
                    onChange={handleDateRangeChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    className="bg-gray-800 text-white p-2 rounded-lg mt-2"
                />
            </div>

            {/* Price Data Graph */}
            <div className="mt-6">
                <h3 className="text-xl font-bold text-white">Price Trends</h3>
                <div className="mt-4 h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="Timestamp" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <RechartsTooltip
                                contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                                labelStyle={{ color: "#D1D5DB" }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="closePrice" stroke="#10B981" name="Close Price" />
                            <Line type="monotone" dataKey="openPrice" stroke="#3B82F6" name="Open Price" />
                            <Line type="monotone" dataKey="highPrice" stroke="#EF4444" name="High Price" />
                            <Line type="monotone" dataKey="lowPrice" stroke="#F59E0B" name="Low Price" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Volume Data Graph */}
            <div className="mt-6">
                <h3 className="text-xl font-bold text-white">Volume Trends</h3>
                <div className="mt-4 h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="Timestamp" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <RechartsTooltip
                                contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                                labelStyle={{ color: "#D1D5DB" }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="volume" stroke="#8B5CF6" name="Volume" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Backfill Modal */}
            <Modal
                isOpen={showBackfillModal}
                onRequestClose={() => setShowBackfillModal(false)}
                contentLabel="Backfill Historical Data"
                className="modal"
                overlayClassName="overlay"
            >
                <h2 className="text-xl font-bold text-white">No Historical Data Found</h2>
                <p className="text-gray-200 mt-2">Would you like to backfill historical data for {symbol}?</p>
                <div className="mt-4 flex space-x-4">
                    <button
                        onClick={handleBackfillConfirmation}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Yes, Backfill Data
                    </button>
                    <button
                        onClick={() => setShowBackfillModal(false)}
                        className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>

            {/* Backfill Logs Display */}
                {backfillLogs.length > 0 && (
                    console.log("bacfillLogs: ", backfillLogs),
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold text-white">Backfill Status:</h3>
                        <ul className="mt-2 text-gray-300">
                            {backfillLogs.map((log, index) => (
                                <li key={index}>
                                    {`${log.timestamp} - ${log.symbol} (${log.interval}): ${log.message}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
        </div>
    );
};

export default SecurityPrice;

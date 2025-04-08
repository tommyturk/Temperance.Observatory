import React, { useState } from "react";
import SearchSecurities from "../features/securities/SecuritiesSearch.jsx";
import SecurityOverview from "../features/securities/SecurityOverview.jsx";
import EarningsData from "../features/securities/EarningsData.jsx";
import BalanceSheet from "../features/securities/BalanceSheet.jsx";
import SecurityPrice from "../features/securities/SecurityPrice.jsx";
// import Positions from "../features/securities/Positions.jsx";
// import TradeSignals from "../features/securities/TradeSignals.jsx";
// import PriceSummary from "../features/securities/PriceSummary.jsx";
// import TimeSeriesChart from "../features/securities/TimeSeriesChart.jsx";

const Dashboard = () => {
    const [selectedSecurity, setSelectedSecurity] = useState(null);

    return (
        <div className="w-full bg-gray-900 min-h-screen text-white space-y-6 p-4 md:p-6">
            <h1 className="text-3xl md:text-4xl font-bold">Trading Dashboard</h1>
            <SearchSecurities onSelectSecurity={setSelectedSecurity} />
            {selectedSecurity && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <SecurityPrice symbol={selectedSecurity} />
                    <SecurityOverview symbol={selectedSecurity} />
                    <EarningsData symbol={selectedSecurity} />
                    <BalanceSheet symbol={selectedSecurity} />
                    
                    {/* <Positions symbol={selectedSecurity} />
                    <TradeSignals symbol={selectedSecurity} />
                    <PriceSummary symbol={selectedSecurity} />
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <TimeSeriesChart symbol={selectedSecurity} />
                    </div>  */}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
import React, { useState } from "react";
import { searchSecurity } from "./securitiesAPI";

const SearchSecurities = () => {
    const [query, setQuery] = useState("");
    const [securities, setSecurities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!query) return; // Don't search if the query is empty
        setLoading(true);
        setError(null); // Reset error before making a new request

        try {
            const response = await searchSecurity(query); // Assuming `searchSecurity` returns the correct response
            console.log("response: ", response); // Add this line to inspect the response
            console.log("response.bestMatches: ", response.data.bestMatches); // Add this line to inspect the bestMatches
            if (response && response.data.bestMatches) {
                console.log("bestMatches: ", response.data.bestMatches); // Add this line to inspect the bestMatches
                setSecurities(response.data.bestMatches); 
            } else {
                setSecurities([]);
            }
        } catch (err) {
            setError("Error searching securities.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold">Search Securities</h2>
            <input
                type="text"
                className="mt-2 p-2 rounded-md"
                placeholder="Search by symbol or name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                onClick={handleSearch}
                className="ml-2 p-2 bg-blue-500 text-white rounded-md"
                disabled={loading}
            >
                {loading ? "Searching..." : "Search"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <ul className="mt-4">
                {securities.length > 0 ? (
                    securities.map((sec, index) => (
                        <li key={index} className="p-2 border-b border-gray-600">
                            {sec.symbol} - {sec.name} ({sec.type})
                            <br />
                            Region: {sec.region} | Currency: {sec.currency} | Market Open: {sec.marketOpen} | Match Score: {sec.matchScore}
                        </li>
                    ))
                ) : (
                    <p>No securities found.</p>
                )}
            </ul>
        </div>
    );
};

export default SearchSecurities;

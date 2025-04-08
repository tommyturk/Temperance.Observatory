import React, { useState } from "react";
import { searchSecurity } from "./securitiesAPI";

const SearchSecurities = ({ onSelectSecurity }) => {
    const [query, setQuery] = useState("");
    const [securities, setSecurities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = async () => {
        if (!query) return; // Don't search if the query is empty
        setLoading(true);
        try {
            const response = await searchSecurity(query);
            if (response && response.data.bestMatches) {
                setSecurities(response.data.bestMatches);
                setIsOpen(true); // Show results
            } else {
                setSecurities([]);
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Error searching securities: ", error);
            setIsOpen(false);
        }
        setLoading(false);
    };

    const handleSelect = (symbol) => {
        onSelectSecurity(symbol);
        setQuery(""); // Clear search box
        setSecurities([]); // Clear results
        setIsOpen(false); // Close results
    };

    return (
        <div className="bg-gray-800 rounded-md p-4 space-y-4 relative">
            <div className="flex flex-col md:flex-row gap-2">
                <input 
                    type="text" 
                    placeholder="Search securities..." 
                    className="p-2 rounded-md text-black flex-grow"
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    onFocus={() => setIsOpen(securities.length > 0)} // Show results if there are any
                />
                <button 
                    onClick={handleSearch} 
                    className="p-2 bg-blue-500 text-white rounded-md md:w-32"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>
            {isOpen && securities.length > 0 && (
                <ul className="absolute bg-gray-700 w-full mt-2 rounded-md shadow-lg max-h-60 overflow-auto z-10">
                    {securities.map((sec) => (
                        <li 
                            key={sec.symbol} 
                            className="p-2 cursor-pointer hover:bg-gray-600 rounded-md truncate"
                            onClick={() => handleSelect(sec.symbol)}
                        >
                            <span className="font-medium">{sec.symbol}</span>
                            <span className="text-gray-400 ml-2 text-sm truncate">{sec.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchSecurities;

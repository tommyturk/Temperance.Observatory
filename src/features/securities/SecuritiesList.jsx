import { useEffect, useState } from "react";
import { getAllSecurities } from "./securitiesAPI";

const SecuritiesList = () => {
    const [securities, setSecurities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const data = await getAllSecurities();
            setSecurities(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <p>Loading securities...</p>;

    return (
        <div>
            <h2>Available Securities</h2>
            <ul>
                {securities.map(sec => (
                    <li key={sec.id}>
                        {sec.symbol} - {sec.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SecuritiesList;

import { useEffect, useState } from 'react';
import { FaGlobe, FaMoon } from 'react-icons/fa'; // Importieren der Icons

interface DistanceData {
    [year: string]: number;
}

const EARTH_CIRCUMFERENCE_KM = 40075;
const MOON_DISTANCE_KM = 384400;

const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

const TotalKilometers = () => {
    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/read-data');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data: DistanceData = await response.json();
                const totalDistance = Object.values(data).reduce((acc, distance) => acc + distance, 0);
                setTotal(totalDistance);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const totalFormatted = total ? formatNumber(total) : '0';
    const earthCircumferenceTimes = total ? (total / EARTH_CIRCUMFERENCE_KM).toFixed(2) : '0';
    const distanceToMoonRemaining = total ? formatNumber(MOON_DISTANCE_KM - total) : '0';
    const distanceToMoonRemainingText = total && total < MOON_DISTANCE_KM
        ? `Und noch ${distanceToMoonRemaining} km bis zum`
        : total ? `Du hast die Entfernung um ${formatNumber(total - MOON_DISTANCE_KM)} km überschritten.` : '';

    return (
        <div className="flex flex-col items-start">
            <div className="flex flex-col items-start p-4">
                <div className="text-gray-500 text-sm mb-1">Kilometer total</div>
                <div className="text-black text-4xl font-semibold">{totalFormatted} km</div>
                <div className="text-black text-md mt-2 flex items-center">     
                    Das sind {earthCircumferenceTimes} Mal um die  <FaGlobe className="ml-2 text-blue-500" /> 
                </div>
                <div className="text-black text-md mt-2 flex items-center">
                    {distanceToMoonRemainingText} <FaMoon className="ml-2 text-yellow-500" />
                </div>
            </div>
        </div>
    );
};

export default TotalKilometers;

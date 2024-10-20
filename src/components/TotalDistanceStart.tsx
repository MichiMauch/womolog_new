import { useEffect, useState } from 'react';

interface DistanceData {
    [year: string]: number;
}

const EARTH_CIRCUMFERENCE_KM = parseInt(process.env.NEXT_PUBLIC_EARTH_CIRCUMFERENCE_KM || '40075', 10);
const MOON_DISTANCE_KM = parseInt(process.env.NEXT_PUBLIC_MOON_DISTANCE_KM || '384400', 10);

const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

const TotalKilometersStart = () => {
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
    
    return (
        <div className="flex flex-col items-start">
            <div className="flex flex-col items-start p-4">
                <div className="text-gray-500 text-sm mb-1">Kilometer total</div>
                <div className="text-black text-4xl font-semibold">{totalFormatted}</div>
            </div>
        </div>
    );
};

export default TotalKilometersStart;

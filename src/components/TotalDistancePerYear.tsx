import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DistanceData {
    [year: string]: number;
}

const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-lg">
                <p className="label">{`${label}`}</p>
                <p className="intro">{`Kilometer: ${formatNumber(payload[0].value)}`}</p>
            </div>
        );
    }

    return null;
};

const KilometersPerYear = () => {
    const [data, setData] = useState<DistanceData | null>(null);
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
                setData(data);
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

    // Formatieren der Daten für das Balkendiagramm
    const chartData = data ? Object.entries(data).map(([year, distance]) => ({ year, distance })) : [];

    const labels = chartData.map(item => item.year);
    const distances = chartData.map(item => item.distance);

    const chartConfig = {
        labels,
        datasets: [
            {
                label: 'Kilometer',
                data: distances,
                backgroundColor: '#8470FF',
                borderRadius: 6,
                barThickness: 15, // Set the bar thickness to 10
                maxBarThickness: 20, // Set the maximum bar thickness to 15
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Kilometer: ${formatNumber(context.parsed.x)}`;
                    }
                }
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Kilometer',
                },
                ticks: {
                    callback: function(value) {
                        return formatNumber(value);
                    }
                },
                grid: {
                    drawBorder: false,
                    drawOnChartArea: true,
                    drawTicks: true,
                    borderDash: [5, 5],
                    color: (context) => {
                        if (context.tick && context.tick.value === distances[distances.length - 1]) {
                            return 'transparent';
                        }
                        return 'rgba(0, 0, 0, 0.1)';
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Jahr',
                },
                grid: {
                    drawBorder: false,
                    drawOnChartArea: false,
                    drawTicks: true,
                },
            },
        },
    };

    return (
        <div className="flex flex-col items-start p-4">
            <div className="text-gray-500 text-sm mb-1">Kilometer pro Jahr</div>
            <div style={{ width: '100%', height: '300px' }}>
                <Bar data={chartConfig} options={options} />
            </div>
            
        </div>
    );
};

export default KilometersPerYear;

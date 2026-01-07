import { useState } from "react";
import {
    Box,
    Heading,
    Spinner,
    Text,
    Alert,
    AlertIcon,
    Select,
    FormControl,
    FormLabel,
    Flex,
    Grid,
} from "@chakra-ui/react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {
    useGetReportHarvestBy,
    useGetReportEggProduction,
    useGetSalesReportByMonth,
    useGetEggInventoryTotalQuantityReport,
} from "../hooks/ReportRepository";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

// Constants
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const PIE_CHART_COLORS = [
    "rgba(54, 162, 235, 0.6)",   // Blue
    "rgba(75, 192, 192, 0.6)",   // Green
    "rgba(255, 159, 64, 0.6)",   // Orange
    "rgba(153, 102, 255, 0.6)",  // Purple
    "rgba(255, 99, 132, 0.6)",   // Red
    "rgba(255, 205, 86, 0.6)",   // Yellow
];

const PIE_CHART_BORDER_COLORS = [
    "rgba(54, 162, 235, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(255, 205, 86, 1)",
];

const Dashboard = () => {
    // ==================== Harvest By Report ====================
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [selectedMonth, setSelectedMonth] = useState<number | null>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);
    

    const { data, isLoading, error } = useGetReportHarvestBy(selectedMonth, selectedYear);
    const report = data?.results;

    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
    const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedMonth(value === "" ? null : parseInt(value));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedYear(value === "" ? null : parseInt(value));
    };


    const getChartTitle = () => {
        let title = "Egg Harvest Report";
        if (selectedMonth && selectedYear) {
            title += ` - ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
        } else if (selectedYear) {
            title += ` - ${selectedYear}`;
        } else if (selectedMonth) {
            title += ` - ${MONTH_NAMES[selectedMonth - 1]}`;
        }
        return title;
    };

    // Harvest By Report - Chart Data & Options
    const harvestByChartData = report && report.length > 0 ? {
        labels: report.map((item) => item.harvestBy),
        datasets: [
            {
                label: "Count",
                data: report.map((item) => item.count),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    } : {
        labels: [],
        datasets: [
            {
                label: "Count",
                data: [],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    const harvestByChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: getChartTitle(),
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Harvest By",
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Count",
                },
            },
        },
    };

    // ==================== Egg Production Report ====================
    const { data: eggProductionData, isLoading: isEggProductionLoading, error: eggProductionError } = useGetReportEggProduction();

    // Egg Production Report - Chart Data & Options
    const eggProductionChartData = eggProductionData && eggProductionData.length > 0 ? {
        labels: eggProductionData.map((item) => item.month),
        datasets: [
            {
                label: "Small",
                data: eggProductionData.map((item) => item.small),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
            {
                label: "Medium",
                data: eggProductionData.map((item) => item.medium),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
            {
                label: "Large",
                data: eggProductionData.map((item) => item.large),
                backgroundColor: "rgba(255, 159, 64, 0.6)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
            },
        ],
    } : {
        labels: [],
        datasets: [
            {
                label: "Small",
                data: [],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
            {
                label: "Medium",
                data: [],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
            {
                label: "Large",
                data: [],
                backgroundColor: "rgba(255, 159, 64, 0.6)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
            },
        ],
    };

    const eggProductionChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Egg Production by Month",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Month",
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Total Eggs Harvested",
                },
            },
        },
    };

    // ==================== Egg Inventory Total Quantity Report ====================
    const { data: eggInventoryTotalQuantityData, isLoading: isEggInventoryTotalQuantityLoading, error: eggInventoryTotalQuantityError } = useGetEggInventoryTotalQuantityReport();

    // Egg Inventory Total Quantity Report - Chart Data & Options
    const eggInventoryChartData = Array.isArray(eggInventoryTotalQuantityData) && eggInventoryTotalQuantityData.length > 0 ? {
        labels: eggInventoryTotalQuantityData.map((item) => item.eggSize || "Unknown"),
        datasets: [
            {
                label: "Total Quantity",
                data: eggInventoryTotalQuantityData.map((item) => item.totalQuantity || 0),
                backgroundColor: PIE_CHART_COLORS.slice(0, eggInventoryTotalQuantityData.length),
                borderColor: PIE_CHART_BORDER_COLORS.slice(0, eggInventoryTotalQuantityData.length),
                borderWidth: 1,
            },
        ],
    } : {
        labels: [],
        datasets: [
            {
                label: "Total Quantity",
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    };

    const eggInventoryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                display: true,
            },
            title: {
                display: true,
                text: "Egg Inventory Total Quantity",
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || "";
                        const value = context.parsed || 0;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    // ==================== Sales Report ====================
    const { data: salesReportData, isLoading: isSalesReportLoading, error: salesReportError } = useGetSalesReportByMonth();
    // Sales Report year selector
    const [selectedSalesYear, setSelectedSalesYear] = useState<number | null>(currentYear);

    const handleSalesYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedSalesYear(value === "" ? null : parseInt(value));
    };
    // Filter sales report data by selected year
    const filteredSalesReportData = salesReportData?.filter((item) => 
        selectedSalesYear === null || item.year === selectedSalesYear
    ) || [];

    // Get available years from sales report data for the year selector
    const availableSalesYears = salesReportData 
        ? Array.from(new Set(salesReportData.map((item) => item.year))).sort((a, b) => b - a)
        : [];

    // Sales Report - Chart Data & Options
    const salesChartData = filteredSalesReportData && filteredSalesReportData.length > 0 ? {
        labels: filteredSalesReportData.map((item) => item.month),
        datasets: [
            {
                label: "Small",
                data: filteredSalesReportData.map((item) => item.small),
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.1)",
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: "Medium",
                data: filteredSalesReportData.map((item) => item.medium),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: "Large",
                data: filteredSalesReportData.map((item) => item.large),
                borderColor: "rgba(255, 159, 64, 1)",
                backgroundColor: "rgba(255, 159, 64, 0.1)",
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    } : {
        labels: [],
        datasets: [
            {
                label: "Small",
                data: [],
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.1)",
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: "Medium",
                data: [],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: "Large",
                data: [],
                borderColor: "rgba(255, 159, 64, 1)",
                backgroundColor: "rgba(255, 159, 64, 0.1)",
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const salesChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: selectedSalesYear 
                    ? `Total Sales by Month - ${selectedSalesYear}`
                    : "Total Sales by Month",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Month",
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Total Sales",
                },
            },
        },
    };

    return (
        <Box p={6}>
            <Heading mb={6}>Dashboard</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                {/* Harvest By Report */}
                <Box bg="white" p={6} borderRadius="md" boxShadow="md">
                    <Box mb={6}>
                        <Flex gap={4} alignItems="end">
                            <FormControl width="200px">
                                <FormLabel>Month</FormLabel>
                                <Select
                                    value={selectedMonth ?? ""}
                                    onChange={handleMonthChange}
                                >
                                    <option value="">All Months</option>
                                    {monthOptions.map((month) => (
                                        <option key={month} value={month}>
                                            {MONTH_NAMES[month - 1]}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl width="150px">
                                <FormLabel>Year</FormLabel>
                                <Select
                                    value={selectedYear ?? ""}
                                    onChange={handleYearChange}
                                >
                                    <option value="">All Years</option>
                                    {yearOptions.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Flex>
                    </Box>
                    <Box h="400px">
                        {isLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Spinner size="xl" />
                            </Box>
                        ) : error ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Alert status="error">
                                    <AlertIcon />
                                    <Text>Error loading report data: {error.message}</Text>
                                </Alert>
                            </Box>
                        ) : !report || report.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Text fontSize="lg" color="gray.500">No data available for the selected period</Text>
                            </Box>
                        ) : (
                            <Bar data={harvestByChartData} options={harvestByChartOptions} />
                        )}
                    </Box>
                </Box>

                {/* Egg Production by Month Report */}
                <Box bg="white" p={6} borderRadius="md" boxShadow="md">
                     <Box h="400px">
                        {isEggProductionLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Spinner size="xl" />
                            </Box>
                        ) : eggProductionError ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Alert status="error">
                                    <AlertIcon />
                                    <Text>Error loading egg production data: {eggProductionError.message}</Text>
                                </Alert>
                            </Box>
                        ) : !eggProductionData || eggProductionData.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Text fontSize="lg" color="gray.500">No data available</Text>
                            </Box>
                        ) : (
                            <Bar data={eggProductionChartData} options={eggProductionChartOptions} />
                        )}
                    </Box>
                </Box>

                {/* Egg Inventory Total Quantity Report */}
                <Box bg="white" p={6} borderRadius="md" boxShadow="md">
                    <Box h="400px">
                        {isEggInventoryTotalQuantityLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Spinner size="xl" />
                            </Box>
                        ) : eggInventoryTotalQuantityError ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Alert status="error">
                                    <AlertIcon />
                                    <Text>Error loading egg inventory total quantity data: {eggInventoryTotalQuantityError?.message}</Text>
                                </Alert>
                            </Box>
                        ) : !eggInventoryTotalQuantityData || !Array.isArray(eggInventoryTotalQuantityData) || eggInventoryTotalQuantityData.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Text fontSize="lg" color="gray.500">No data available</Text>
                            </Box>
                        ) : (
                            <Pie 
                                data={eggInventoryChartData} 
                                options={eggInventoryChartOptions}
                                key={JSON.stringify(eggInventoryChartData)}
                            />
                        )}
                    </Box>
                </Box>

                {/* Sales Report */}
                <Box bg="white" p={6} borderRadius="md" boxShadow="md">
                    <Box mb={6}>
                        <FormControl width="150px">
                            <FormLabel>Year</FormLabel>
                            <Select
                                value={selectedSalesYear ?? ""}
                                onChange={handleSalesYearChange}
                            >
                                <option value="">All Years</option>
                                {availableSalesYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box h="400px">
                        {isSalesReportLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Spinner size="xl" />
                            </Box>
                        ) : salesReportError ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Alert status="error">
                                    <AlertIcon />
                                    <Text>Error loading sales report data: {salesReportError.message}</Text>
                                </Alert>
                            </Box>
                        ) : !salesReportData || salesReportData.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Text fontSize="lg" color="gray.500">No data available</Text>
                            </Box>
                        ) : filteredSalesReportData.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                                <Text fontSize="lg" color="gray.500">No data available for the selected year</Text>
                            </Box>
                        ) : (
                            <Line data={salesChartData} options={salesChartOptions} />
                        )}
                    </Box>
                </Box>
            </Grid>
        </Box>
    );
};

export default Dashboard;

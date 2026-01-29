import { useQuery } from "@tanstack/react-query";
import { ReportHaravestBy } from "../entiies/Report/ReportHaravestBy";
import APIClient, { FetchResponse } from "../services/apiClient";
import { ReportEggProduction } from "../entiies/Report/ReportEggProduction";
import { EggInventoryTotalQuantityReport } from "../entiies/Report/EggInventoryTotalQuantityReport";
import { SalesReport } from "../entiies/Report/SalesReport";
import { TotalSalesReport } from "../entiies/Report/TotalSalesReport";


const getReportHarvestBy = new APIClient<ReportHaravestBy>("/Report/harvestby");
const getReportEggProduction = new APIClient<ReportEggProduction>("/Report/eggproduction");
const getEggInventoryTotalQuantityReport = new APIClient<EggInventoryTotalQuantityReport>("/Report/egginventorytotalquantity");
const getSalesReportByMonth = new APIClient<SalesReport>("/Report/salesreport-by-month");
const getTotalSalesReport = new APIClient<TotalSalesReport>("/Report/totalsales");
const getTotalExpensesReport = new APIClient<TotalSalesReport>("/Report/totalexpenses");
const getTotalProfitReport = new APIClient<TotalSalesReport>("/Report/totalprofit");
const getUpcomingEventCount = new APIClient<number>("/Report/upcoming-event");

export const useGetReportHarvestBy = (month?: number | null, year?: number | null) => {
    return useQuery<FetchResponse<ReportHaravestBy>, Error>({
        queryKey: ["harvestby", month, year],
        queryFn: () => {
            const params: Record<string, string> = {};
            if (month !== null && month !== undefined) {
                params.month = month.toString();
            }
            if (year !== null && year !== undefined) {
                params.year = year.toString();
            }
            return getReportHarvestBy.getAll({ params });
        },
    });
};

// Interface for egg production by month data (matching API response)
export interface EggProductionByMonth {
    month: string;
    small: number;
    medium: number;
    large: number;
    year?: number;
    monthNumber?: number;
}

export const useGetReportEggProduction = () => {
    return useQuery<EggProductionByMonth[], Error>({
        queryKey: ["eggproduction"],
        queryFn: async () => {
            const response = await getReportEggProduction.getAll();
            return response.results as unknown as EggProductionByMonth[];
        },
    });
};

export const useGetEggInventoryTotalQuantityReport = () => {
    return useQuery<EggInventoryTotalQuantityReport[], Error>({
        queryKey: ["egginventorytotalquantityreport"],
        queryFn: async () => {
            const response = await getEggInventoryTotalQuantityReport.getAll();
            return response.results as unknown as EggInventoryTotalQuantityReport[];
        },
    });
};

export const useGetSalesReportByMonth = () => {
    return useQuery<SalesReport[], Error>({
        queryKey: ["salesreport"],
        queryFn: async () => {
            const response = await getSalesReportByMonth.getAll();
            return response.results as unknown as SalesReport[];
        },
    });
};

export const useGetTotalSalesReport = () => {
    return useQuery<number, Error>({
        queryKey: ["totalsalesreport"],
        queryFn: async () => {
            const response = await getTotalSalesReport.getAll();
            return response.results as unknown as number;
        },
    });
}

export const useGetTotalExpensesReport = () => {
    return useQuery<number, Error>({
        queryKey: ["totalexpensesreport"],
        queryFn: async () => {
            const response = await getTotalExpensesReport.getAll();
            return response.results as unknown as number;
        },
    });
}

export const useGetTotalProfitReport = () => {
    return useQuery<number, Error>({
        queryKey: ["totalprofitreport"],
        queryFn: async () => {
            const response = await getTotalProfitReport.getAll();
            return response.results as unknown as number;
        },
    });
}

export const useGetUpcomingEventCount = () => {
    return useQuery<number, Error>({
        queryKey: ["upcomingeventcount"],
        queryFn: async () => {
            const response = await getUpcomingEventCount.getAll();
            return response.results as unknown as number;
        },
    });
}
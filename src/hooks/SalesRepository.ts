import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CreateSales } from "../entiies/Dto/CreateSales";
import APIClient, { FetchResponse } from "../services/apiClient";
import { Sales } from "../entiies/Sales";
import { SalesReport } from "../entiies/Report/SalesReport";

//endpoints
const apiClient = new APIClient<CreateSales>("/Sales/add-sales-record");
const getAllSales = new APIClient<Sales>("/Sales/all-sales");
const getAllTransactedByNames = new APIClient<string>("/Sales/all-transactedby-names");

//hooks
export const useCreateSales = () => {
    const queryClient = useQueryClient();
    
    return useMutation<CreateSales, Error, CreateSales>({
        mutationFn: (data: CreateSales) => apiClient.post(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
        },
    });
};
export const useGetAllSales = (transactedBy: string, fromDate: string, toDate: string) => {
    return useQuery<FetchResponse<Sales>, Error>({
        queryKey: ["sales", transactedBy, fromDate, toDate],
        queryFn: () => getAllSales.getAll({
            params: {
                transactedBy: transactedBy,
                fromDate: fromDate,
                toDate: toDate,
            },
        }),
    });
};

export const useGetAllTransactedByNames = () => {
    return useQuery<string[], Error>({
        queryKey: ["transactedByNames"],
        queryFn: async () => {
            const response = await getAllTransactedByNames.getAll();
            return response.results as unknown as string[];
        },
    });
};
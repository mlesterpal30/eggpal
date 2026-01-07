import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CreateSales } from "../entiies/Dto/CreateSales";
import APIClient, { FetchResponse } from "../services/apiClient";
import { Sales } from "../entiies/Sales";
import { SalesReport } from "../entiies/Report/SalesReport";

const apiClient = new APIClient<CreateSales>("/Sales/add-sales-record");
const getAllSales = new APIClient<Sales>("/Sales/all-sales");

export const useCreateSales = () => {
    const queryClient = useQueryClient();
    
    return useMutation<CreateSales, Error, CreateSales>({
        mutationFn: (data: CreateSales) => apiClient.post(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
        },
    });
};
export const useGetAllSales = () => {
    return useQuery<FetchResponse<Sales>, Error>({
      queryKey: ["sales"],
      queryFn: () =>
        getAllSales.getAll().then(
          res => res as unknown as FetchResponse<Sales>
        ),
    });
  };
  
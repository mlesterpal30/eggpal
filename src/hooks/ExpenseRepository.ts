import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CreateExpense } from "../entiies/Dto/CreateExpense";
import APIClient, { FetchResponse } from "../services/apiClient";
import { Expense } from "../entiies/Expense";

//endpoints
const apiClient = new APIClient<CreateExpense>("/Expenses/add-expense-record");
const getAllExpenses = new APIClient<Expense>("/Expenses/all-expenses-records");

//hooks
export const useCreateExpense = () => {
    const queryClient = useQueryClient();
    
    return useMutation<CreateExpense, Error, CreateExpense>({
        mutationFn: (data: CreateExpense) => apiClient.post(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });
};

export const useGetAllExpenses = (date: string) => {
    return useQuery<FetchResponse<Expense>, Error>({
        queryKey: ["expenses", date],
        queryFn: () => getAllExpenses.getAll({
            params: {
                date: date,
            },
        }),
    });
};

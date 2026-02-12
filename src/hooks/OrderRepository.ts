import APIClient from "../services/apiClient";
import { CreateOrder } from "../entiies/Dto/CreateOrder";
import { useMutation } from "@tanstack/react-query";


const apiClient = new APIClient<CreateOrder>("/Order/create-order");

export const useCreateOrder = () => {
    return useMutation<CreateOrder, Error, CreateOrder>({
        mutationFn: (data: CreateOrder) => apiClient.post(data),
    });
};

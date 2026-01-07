import APIClient, { FetchResponse } from "../services/apiClient";
import { CreateEgg } from "../entiies/Dto/CreateEgg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Egg } from "../entiies/Egg";

const createEgg = new APIClient<CreateEgg>("/Inventory/add-egg-record");
const getAllEggs = new APIClient<Egg>("/Inventory/all-egg-records");
export const useCreateEgg = () => {
    return useMutation<CreateEgg, Error, CreateEgg>({
        mutationFn: (data: CreateEgg) => createEgg.post(data),
    });
};

export const useGetAllEggs = () => {
    return useQuery<FetchResponse<Egg>, Error>({
        queryKey: ["eggs"],
        queryFn: () => getAllEggs.getAll(),
    });
};
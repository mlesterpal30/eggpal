import APIClient, { FetchResponse } from "../services/apiClient";
import { CreateHarvest } from "../entiies/Dto/CreateHarvest";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Harvest } from "../entiies/Harvest";

//endpoints
const createHarvest = new APIClient<CreateHarvest>("/Inventory/add-harvest-record");
const getAllHarvests = new APIClient<Harvest>("/Inventory/all-harvest-records");
const getAllHarvesters = new APIClient<string>("/Inventory/all-harvesters");

//hooks
export const useCreateHarvest = () => {
    return useMutation<CreateHarvest, Error, CreateHarvest>({
        mutationFn: (data: CreateHarvest) => createHarvest.post(data),
    });
};

export const useGetAllHarvests = (harvestBy: string, fromDate: string, toDate: string) => {
    return useQuery<FetchResponse<Harvest>, Error>({
        queryKey: ["harvests", harvestBy, fromDate, toDate],
        queryFn: () => getAllHarvests.getAll({
            params: {
                harvestBy: harvestBy,
                fromDate: fromDate,
                toDate: toDate,
            },
        }),
    });
};

export const useGetAllHarvesters = () => {
    return useQuery<string[], Error>({
        queryKey: ["harvesters"],
        queryFn: async () => {
            const response = await getAllHarvesters.getAll();
            return response.results as unknown as string[];
        },
    });
};


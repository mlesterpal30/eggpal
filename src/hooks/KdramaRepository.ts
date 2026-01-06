import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Kdrama } from "../entiies/Kdrama";
import { Genre } from "../entiies/Kdrama";
import APIClient, { FetchResponse } from "../services/apiClient";
import useKrdramaQueryStore from "../store";


const apiClient = new APIClient<Kdrama>("/Kdrama");
const getGenres = new APIClient<Genre>("/Kdrama/genres");

export const useGetKdramas = (genreId: number) => {
    const kdramaQuery = useKrdramaQueryStore((s) => s.kdramaQuery);
    return useInfiniteQuery<FetchResponse<Kdrama>, Error>({
        queryKey: ["kdramas", kdramaQuery, genreId],
        queryFn: ({ pageParam = 1 }) => 
            apiClient.getAll({
                params: {
                    genreId: genreId,
                    page: pageParam,
                    pageSize: 15, // Adjust page size as needed
                    rating: kdramaQuery.rating,
                }
            }),
        getNextPageParam: (lastPage, allPages) => {
            // Use the hasMore field from the API response to determine if there are more pages
            return lastPage.hasMore ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
    });
};

export const useGetKdrama = (id: number | string) => {
    return useQuery<Kdrama, Error>({
        queryKey: ["kdrama", id],
        queryFn: () => apiClient.get(id),
        enabled: !!id,
    });
};

export const useCreateKdrama = () => {
    const queryClient = useQueryClient();
    
    return useMutation<Kdrama, Error, Kdrama>({
        mutationFn: (data: Kdrama) => apiClient.post(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kdramas"] });
        },
    });
};

export const useUpdateKdrama = () => {
    const queryClient = useQueryClient();
    
    return useMutation<Kdrama, Error, { id: number | string; data: Kdrama }>({
        mutationFn: ({ id, data }: { id: number | string; data: Kdrama }) => 
            apiClient.put(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["kdramas"] });
            queryClient.invalidateQueries({ queryKey: ["kdrama", variables.id] });
        },
    });
};

export const useDeleteKdrama = () => {
    const queryClient = useQueryClient();
    
    return useMutation<Kdrama, Error, number | string>({
        mutationFn: (id: number | string) => apiClient.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kdramas"] });
        },
    });
};

export const useGetGenres = () => {
    return useQuery<FetchResponse<Genre>, Error>({
        queryKey: ["genres"],
        queryFn: () => getGenres.getAll(),
    });
};
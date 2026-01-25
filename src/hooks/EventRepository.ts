import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/apiClient";
import { Event } from "../entiies/Event";
import { CreateEvent } from "../entiies/Dto/CreateEvent";

const createEventClient = new APIClient<CreateEvent>("/Event/create-event");
const getEventsClient = new APIClient<Event>("/Event/all-events");

export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation<CreateEvent, Error, CreateEvent>({
        mutationFn: (data: CreateEvent) => createEventClient.post(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        }
    });
};

export const useGetEvents = (fromDate: string | null) => {
    return useQuery<FetchResponse<Event>, Error>({
        queryKey: ["events", fromDate],
        queryFn: () => getEventsClient.getAll({
            params: {
                fromDate: fromDate,
            },
        }),
    });
};




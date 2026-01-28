import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/apiClient";
import { Event } from "../entiies/Event";
import { CreateEvent } from "../entiies/Dto/CreateEvent";

const createEventClient = new APIClient<CreateEvent>("/Event/create-event");
const getEventsClient = new APIClient<Event>("/Event/all-events");
const deleteEventClient = new APIClient<Event>("/Event/delete-event");
const updateEventClient = new APIClient<Event>("/Event/update-event");

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

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    return useMutation<Event, Error, number>({
        mutationFn: (id: number) => deleteEventClient.delete({
            params: {
                eventId: id,
            },
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        }
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation<Event, Error, Event>({
        mutationFn: (event: Event) => updateEventClient.put(event.id, event),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["events", variables.id] });
        }
    });
};




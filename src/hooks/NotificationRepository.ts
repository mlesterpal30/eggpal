import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/apiClient";
import { Notification } from "../entiies/Notification";

const apiClient = new APIClient<Notification>("/Notification/notifications");
const markNotificationAsRead = new APIClient<Notification>("/Notification/markNotificationAsRead");
const deleteNotification = new APIClient<Notification>("/Notification/deleteNotification");

export const useGetNotifications = () => {
    return useQuery<FetchResponse<Notification>, Error>({
        queryKey: ["notifications"],
        queryFn: () => apiClient.getAll(),
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation<Notification, Error, { notificationId: number }>({
        mutationFn: ({ notificationId }: { notificationId: number }) => markNotificationAsRead.put(notificationId, null), 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation<Notification, Error, { notificationId: number }>({
        mutationFn: ({ notificationId }: { notificationId: number }) => deleteNotification.delete(notificationId), 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};
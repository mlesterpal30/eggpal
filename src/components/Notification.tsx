import { Button, MenuButton, MenuList, MenuItem, Menu, Skeleton, VStack, Box, Heading, Divider, IconButton } from "@chakra-ui/react";
import { IoNotifications } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { useDeleteNotification, useGetNotifications, useMarkNotificationAsRead } from "../hooks/NotificationRepository";
import { useState } from "react";

const Notification = () => {
  const { data, isLoading, error } = useGetNotifications();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteNotificationMutation = useDeleteNotification();
  return (
    <Menu>
      <MenuButton as={Button}>
          <IoNotifications className="text-2xl" />
      </MenuButton>
      <MenuList minW="300px" maxH="400px" overflowY="auto" p={5}>
        {isLoading ? (
          <Box p={3}>
            <VStack spacing={2} align="stretch">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="40px" borderRadius="md" />
              ))}
            </VStack>
          </Box>
        ) : 
        error ? (
          <MenuItem>An error occurred while fetching notifications</MenuItem>
        ) : (
          <Box fontFamily="geist" >
            <Heading fontSize="2xl" fontWeight="bold" mb={2}>Notifications</Heading>
            <Divider />
            <Box fontSize="sm">
              {data && data.results.length > 0 ? 
                data.results.map((notification) => (
                  <Box
                    key={notification.id}
                    as={MenuItem}
                    py={3.5}
                    position="relative"
                    role="group"
                    data-menu-open={openMenuId === notification.id}
                    _hover={{
                      "& .notification-menu": {
                        opacity: 1,
                        visibility: "visible"
                      }
                    }}
                    sx={{
                      "&[data-menu-open='true'] .notification-menu": {
                        opacity: "1 !important",
                        visibility: "visible !important"
                      }
                    }}
                  >
                    <Box>
                      {!notification.isRead && (
                        <Box className="w-3 h-3 bg-blue-500 rounded-full mr-2 " />
                      )}
                    </Box>
                    <Box flex="1" maxW="90%">{notification.message}</Box>
                    <Menu
                      isOpen={openMenuId === notification.id}
                      onOpen={() => setOpenMenuId(notification.id)}
                      onClose={() => setOpenMenuId(null)}
                    >
                      <MenuButton
                        as={IconButton}
                        aria-label="Notification options"
                        icon={<BsThreeDots />}
                        size="sm"
                        borderRadius="full"
                        variant="ghost"
                        position="absolute"
                        right={2}
                        opacity={openMenuId === notification.id ? 1 : 0}
                        visibility={openMenuId === notification.id ? "visible" : "hidden"}
                        transition="opacity 0.2s, visibility 0.2s"
                        bg="white"
                        _hover={{
                          bg: "white",
                          opacity: 1,
                          visibility: "visible"
                        }}
                        className="notification-menu"
                        sx={{
                          ...(openMenuId === notification.id && {
                            opacity: "1 !important",
                            visibility: "visible !important"
                          })
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                      <MenuList>
                        {!notification.isRead && (
                          <MenuItem onClick={(e) => {
                            e.stopPropagation();
                            markAsReadMutation.mutate({ notificationId: notification.id });
                            setOpenMenuId(null);
                          }}>
                            Mark as read
                          </MenuItem>
                        )}
                        <MenuItem onClick={(e) => {
                          e.stopPropagation();
                          deleteNotificationMutation.mutate({ notificationId: notification.id });
                          setOpenMenuId(null);
                        }}
                        >
                          Delete notification
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                )) : (
                  <MenuItem>No notifications found</MenuItem>
                )}
            </Box>
          </Box>
        )}
      </MenuList>
  </Menu>
  )
}

export default Notification
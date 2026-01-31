import { Button, MenuButton, MenuList, MenuItem, Menu, Skeleton, VStack, Box, Heading, Divider, IconButton, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Text, Flex } from "@chakra-ui/react";
import { IoNotifications } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { useDeleteNotification, useGetNotifications, useMarkNotificationAsRead } from "../../hooks/NotificationRepository";
import { Notification as NotificationType } from "../../entiies/Notification";
import { useState, useMemo } from "react";
import { TbBellRingingFilled } from "react-icons/tb";


interface NotificationItemProps {
  notification: NotificationType;
  openMenuId: number | null;
  setOpenMenuId: (id: number | null) => void;
  markAsReadMutation: ReturnType<typeof useMarkNotificationAsRead>;
  deleteNotificationMutation: ReturnType<typeof useDeleteNotification>;
}

const NotificationItem = ({ notification, openMenuId, setOpenMenuId, markAsReadMutation, deleteNotificationMutation }: NotificationItemProps) => {
  return (
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
  );
};

const Notification = () => {
  const { data, isLoading, error } = useGetNotifications();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const filteredNotifications = useMemo(() => {
    if (!data?.results) return [];
    if (tabIndex === 0) return data.results; // All
    return data.results.filter(notification => !notification.isRead); // Unread
  }, [data, tabIndex]);

  const { todayNotifications, olderNotifications } = useMemo(() => {
    if (!filteredNotifications || filteredNotifications.length === 0) {
      return { todayNotifications: [], olderNotifications: [] };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayNotifs: NotificationType[] = [];
    const olderNotifs: NotificationType[] = [];

    filteredNotifications.forEach(notification => {
      const notificationDate = new Date(notification.createdAt);
      notificationDate.setHours(0, 0, 0, 0);
      
      if (notificationDate.getTime() === today.getTime()) {
        todayNotifs.push(notification);
      } else {
        olderNotifs.push(notification);
      }
    });

    return { todayNotifications: todayNotifs, olderNotifications: olderNotifs };
  }, [filteredNotifications]);

  const unreadCount = useMemo(() => {
    if (!data?.results) return 0;
    return data.results.filter(notification => !notification.isRead).length;
  }, [data]);

  return (
    <Menu>
      <MenuButton as={Button} position="relative">
          <IoNotifications className="text-2xl" />
          {unreadCount > 0 && (
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              borderRadius="full"
              bg="red.500"
              color="white"
              fontSize="xs"
              minW="18px"
              h="18px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={1}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
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
            <Tabs index={tabIndex} onChange={setTabIndex} mb={2}>
              <TabList>
                <Tab>All</Tab>
                <Tab>Unread</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0} pt={3}>
                  <Box fontSize="sm">
                    {filteredNotifications.length > 0 ? (
                      <>
                        {todayNotifications.length > 0 && (
                          <>
                            <Heading fontSize="sm" fontWeight="semibold" mb={2} color="gray.900">
                              Today
                            </Heading>
                            {todayNotifications.map((notification) => (
                              <NotificationItem
                                key={notification.id}
                                notification={notification}
                                openMenuId={openMenuId}
                                setOpenMenuId={setOpenMenuId}
                                markAsReadMutation={markAsReadMutation}
                                deleteNotificationMutation={deleteNotificationMutation}
                              />
                            ))}
                          </>
                        )}
                        {todayNotifications.length > 0 && olderNotifications.length > 0 && (
                          <Divider my={2} />
                        )}
                        {olderNotifications.length > 0 && (
                          <>
                            <Heading fontSize="sm" fontWeight="semibold" mb={2} color="gray.900">
                              Earlier
                            </Heading>
                            {olderNotifications.map((notification) => (
                              <NotificationItem
                                key={notification.id}
                                notification={notification}
                                openMenuId={openMenuId}
                                setOpenMenuId={setOpenMenuId}
                                markAsReadMutation={markAsReadMutation}
                                deleteNotificationMutation={deleteNotificationMutation}
                              />
                            ))}
                          </>
                        )}
                      </>
                    ) : (
                      <Box py={3} textAlign="center" color="gray.500">
                        <TbBellRingingFilled className="text-2xl" />
                        <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.500">
                          No notifications found
                        </Text>
                      </Box>
                    )}
                  </Box>
                </TabPanel>
                <TabPanel p={0} pt={3}>
                  <Box fontSize="sm">
                    {filteredNotifications.length > 0 ? 
                      filteredNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          openMenuId={openMenuId}
                          setOpenMenuId={setOpenMenuId}
                          markAsReadMutation={markAsReadMutation}
                          deleteNotificationMutation={deleteNotificationMutation}
                        />
                      )) : (
                        <Box py={3} textAlign="center" color="gray.500" minW="300px">
                          <Flex alignItems="center" justifyContent="center" mb={2}>             
                              <TbBellRingingFilled className="text-5xl" />
                          </Flex>
                            <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.500">
                              No unread notifications
                            </Text>
                          </Box>
                      )}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}
      </MenuList>
  </Menu>
  )
}

export default Notification
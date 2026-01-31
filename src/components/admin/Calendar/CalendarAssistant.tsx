import { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  HStack,
  VStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Spinner,
  Center,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { FaEye } from "react-icons/fa";
import { Temporal } from "temporal-polyfill";
import { useGetEvents, useDeleteEvent, useUpdateEvent } from "../../../hooks/EventRepository";
import { Event } from "../../../entiies/Event";
import { useForm } from "react-hook-form";

const CalendarAssistant = () => {
  const philippinesTimeZone = "Asia/Manila";
  const now = Temporal.Now.zonedDateTimeISO(philippinesTimeZone);
  const today = now.toPlainDate();

  // Initialize with current year, month, and week 1
  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);
  const [week, setWeek] = useState(1);
  
  // State to track when to fetch - only fetch when button is clicked
  const [searchDate, setSearchDate] = useState<string | null>(null);
  
  // Delete modal state
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  
  // Edit modal state
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  
  // Delete event mutation
  const deleteEventMutation = useDeleteEvent();
  
  // Update event mutation
  const updateEventMutation = useUpdateEvent();

  // Edit form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  }>({
    defaultValues: {
      title: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  });

  // Convert year, month, week to date format: DD/MM/YYYY 12:00:00
  // Week value is the starting day (1, 8, 15, 22)
  const fromDate = useMemo(() => {
    try {
      // Get the number of days in the selected month
      const firstDayOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
      const daysInMonth = firstDayOfMonth.daysInMonth;
      
      // Use the week value (starting day), but don't exceed the number of days in the month
      // For week 4 (day 22), if month has fewer days, use the last day of the month
      const dayToUse = Math.min(week, daysInMonth);
      
      // Create a date with the selected year, month, and calculated day
      const date = Temporal.PlainDate.from({ year, month, day: dayToUse });
      
      // Format as YYYY-MM-DD HH:mm:ss (standard format for backend)
      const day = date.day.toString().padStart(2, '0');
      const monthStr = date.month.toString().padStart(2, '0');
      const yearStr = date.year.toString();
      
      return `${yearStr}-${monthStr}-${day} 12:00:00`;
    } catch (error) {
      console.error("Error creating date:", error);
      return null;
    }
  }, [year, month, week]);

  // Check if all values are set
  const isFormValid = year && month && week && fromDate !== null;

  // Fetch events only when searchDate is set (button clicked)
  const { data: eventsData, isLoading } = useGetEvents(searchDate);

  // Handle filter button click
  const handleFilter = () => {
    if (fromDate) {
      setSearchDate(fromDate);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    onDeleteOpen();
  };

  // Extract date from DateTime string (YYYY-MM-DD)
  const extractDate = (dateTimeString: string): string => {
    try {
      // Remove fractional seconds if present
      const cleanDate = dateTimeString.split('.')[0].trim();
      
      // Handle "YYYY-MM-DD HH:mm:ss" format
      if (cleanDate.includes(' ')) {
        const [datePart] = cleanDate.split(' ');
        return datePart;
      }
      
      // Handle ISO format with T
      if (cleanDate.includes('T')) {
        const [datePart] = cleanDate.split('T');
        return datePart;
      }
      
      // If it's already just a date
      if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
        return cleanDate;
      }
      
      return "";
    } catch (error) {
      console.error("Error extracting date:", error);
      return "";
    }
  };

  // Extract time from DateTime string (HH:mm)
  const extractTime = (dateTimeString: string): string => {
    try {
      // Remove fractional seconds if present
      const cleanDate = dateTimeString.split('.')[0].trim();
      
      // Handle "YYYY-MM-DD HH:mm:ss" format
      if (cleanDate.includes(' ')) {
        const [, timePart] = cleanDate.split(' ');
        if (timePart) {
          const [hour, minute] = timePart.split(':');
          return `${hour}:${minute}`;
        }
      }
      
      // Handle ISO format with T
      if (cleanDate.includes('T')) {
        const [, timePart] = cleanDate.split('T');
        if (timePart) {
          // Remove timezone if present
          const timeOnly = timePart.split('+')[0].split('-')[0].split('Z')[0];
          const [hour, minute] = timeOnly.split(':');
          return `${hour}:${minute}`;
        }
      }
      
      return "";
    } catch (error) {
      console.error("Error extracting time:", error);
      return "";
    }
  };

  // Handle edit button click
  const handleEditClick = (event: Event) => {
    setEventToEdit(event);
    
    // Extract date and time from event.start and event.end
    const startDate = extractDate(event.start);
    const startTime = extractTime(event.start);
    const endTime = extractTime(event.end);
    
    // Populate form with event data
    reset({
      title: event.title,
      date: startDate,
      startTime: startTime,
      endTime: endTime,
    });
    
    onEditOpen();
  };

  // Handle edit form submission
  const handleEditSubmit = async (data: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    if (!eventToEdit) return;

    try {
      // Parse date and time
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);
      const selectedDate = Temporal.PlainDate.from(data.date);

      // Create ZonedDateTime objects in Philippines timezone
      const startDateTime = selectedDate
        .toZonedDateTime(philippinesTimeZone)
        .with({ hour: startHour, minute: startMinute });
      const endDateTime = selectedDate
        .toZonedDateTime(philippinesTimeZone)
        .with({ hour: endHour, minute: endMinute });

      // Format dates for .NET compatibility (ISO 8601 with timezone offset, no timezone name)
      // Format: "2024-01-23T06:00:00+08:00"
      const formatDateTimeForDotNet = (zonedDateTime: Temporal.ZonedDateTime): string => {
        const year = zonedDateTime.year.toString().padStart(4, '0');
        const month = zonedDateTime.month.toString().padStart(2, '0');
        const day = zonedDateTime.day.toString().padStart(2, '0');
        const hour = zonedDateTime.hour.toString().padStart(2, '0');
        const minute = zonedDateTime.minute.toString().padStart(2, '0');
        const second = zonedDateTime.second.toString().padStart(2, '0');
        const offset = zonedDateTime.offset; // e.g., "+08:00"
        return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
      };

      // Create updated event data
      const updatedEvent: Event = {
        id: eventToEdit.id,
        title: data.title,
        start: formatDateTimeForDotNet(startDateTime),
        end: formatDateTimeForDotNet(endDateTime),
      };

      // Call the update API
      await updateEventMutation.mutateAsync(updatedEvent);

      // Close modal and reset form
      onEditClose();
      setEventToEdit(null);
      reset({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
      });

      // Refresh the events list by re-triggering the search
      if (searchDate) {
        setSearchDate(null);
        setTimeout(() => setSearchDate(searchDate), 100);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEventMutation.mutateAsync(eventToDelete.id);
        onDeleteClose();
        setEventToDelete(null);
        // Refresh the events list by re-triggering the search
        if (searchDate) {
          setSearchDate(null);
          setTimeout(() => setSearchDate(searchDate), 100);
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  // Format date string for display
  // Backend format: "2026-01-22 21:22:00.000000" -> Display: "22/01/2026 21:22"
  const formatDateForDisplay = (dateString: string): string => {
    try {
      // Remove fractional seconds if present
      const cleanDate = dateString.split('.')[0].trim();
      
      // Parse YYYY-MM-DD HH:mm:ss format
      if (cleanDate.includes(' ')) {
        const [datePart, timePart] = cleanDate.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart ? timePart.split(':') : ['00', '00'];
        
        // Format as DD/MM/YYYY HH:mm
        return `${day}/${month}/${year} ${hour}:${minute}`;
      } else if (cleanDate.includes('T')) {
        // Handle ISO format with T
        const [datePart, timePart] = cleanDate.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart ? timePart.split(':') : ['00', '00'];
        
        return `${day}/${month}/${year} ${hour}:${minute}`;
      }
      
      return dateString; // Return as-is if can't parse
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Generate year options (current year ± 5 years)
  const currentYear = today.year;
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Month options
  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Week options
  const weekOptions = [
    { value: 1, label: "Week 1 (1-7)" },
    { value: 8, label: "Week 2 (8-14)" },
    { value: 15, label: "Week 3 (15-21)" },
    { value: 22, label: "Week 4 (22-end)" },
  ];

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Year</FormLabel>
            <Select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Month</FormLabel>
            <Select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Week</FormLabel>
            <Select
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
            >
              {weekOptions.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </HStack>
        
        <Button
          colorScheme="blue"
          onClick={handleFilter}
          isDisabled={!isFormValid}
          isLoading={isLoading}
          width="fit-content"
        >
          Filter Events
        </Button>
        
        {/* Events Table */}
        {searchDate && (
          <Box mt={6}>
            {isLoading ? (
              <Center py={8}>
                <Spinner size="xl" />
              </Center>
            ) : eventsData?.results && eventsData.results.length > 0 ? (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Title</Th>
                      <Th>Start</Th>
                      <Th>End</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {eventsData.results.map((event: Event) => (
                      <Tr key={event.id}>
                        <Td>{event.id}</Td>
                        <Td>{event.title}</Td>
                        <Td>{formatDateForDisplay(event.start)}</Td>
                        <Td>{formatDateForDisplay(event.end)}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="View event"
                              icon={<FaEye />}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                            />
                            <IconButton
                              aria-label="Edit event"
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="green"
                              variant="ghost"
                              onClick={() => handleEditClick(event)}
                            />
                            <IconButton
                              aria-label="Delete event"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleDeleteClick(event)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Box mt={4} p={4} textAlign="center" bg="gray.50" borderRadius="md">
                <Text color="gray.500">No events found for the selected period.</Text>
              </Box>
            )}
          </Box>
        )}

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Are you sure you want to delete the event "{eventToDelete?.title}"? 
                This action cannot be undone.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmDelete}
                isLoading={deleteEventMutation.isPending}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Event Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalOverlay />
          <ModalContent>
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <ModalHeader>Edit Event</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.title} isRequired>
                    <FormLabel>Event Title</FormLabel>
                    <Input
                      {...register("title", { required: "Event title is required" })}
                      placeholder="Enter event title"
                    />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.date} isRequired>
                    <FormLabel>Date</FormLabel>
                    <Input
                      type="date"
                      {...register("date", { required: "Date is required" })}
                    />
                    <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.startTime} isRequired>
                    <FormLabel>Start Time</FormLabel>
                    <Input
                      type="time"
                      {...register("startTime", { required: "Start time is required" })}
                    />
                    <FormErrorMessage>{errors.startTime?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.endTime} isRequired>
                    <FormLabel>End Time</FormLabel>
                    <Input
                      type="time"
                      {...register("endTime", { required: "End time is required" })}
                    />
                    <FormErrorMessage>{errors.endTime?.message}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onEditClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={updateEventMutation.isPending}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default CalendarAssistant;   
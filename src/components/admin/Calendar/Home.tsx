import { useEffect } from "react";
import { useCalendarApp } from "@schedule-x/react";
import { ScheduleXCalendar } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { Temporal } from "temporal-polyfill";
import { useForm } from "react-hook-form";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useCreateEvent, useGetEvents } from "../../../hooks/EventRepository";
import { CreateEvent } from "../../../entiies/Dto/CreateEvent";
import { Event } from "../../../entiies/Event";

const Home = () => {
    // Get current time in Philippines timezone (Asia/Manila, UTC+8)
    const philippinesTimeZone = "Asia/Manila";
    const now = Temporal.Now.zonedDateTimeISO(philippinesTimeZone);
    const today = now.toPlainDate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const createEventMutation = useCreateEvent();
  const { data: eventsData, isLoading: isEventsLoading } = useGetEvents(null);



  // React Hook Form
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
      date: today.toString(),
      startTime: "",
      endTime: "",
    },
  });

  // Convert API events to Schedule-X format
  const convertEventsToScheduleX = () => {
    if (!eventsData?.results || eventsData.results.length === 0) return [];

    return eventsData.results.map((event: Event) => {
      try {
        // Convert backend string -> Schedule-X Temporal string.
        // Backend: "2026-01-22 21:22:00.000000"
        // Needed:  "2026-01-22T21:22:00+08:00[Asia/Manila]"
        const toScheduleXTemporalString = (value: string): string => {
          const raw = value.trim();

          // If it's ISO + offset but missing [Zone], append it
          if (/[+-]\d{2}:\d{2}$/.test(raw)) return `${raw}[${philippinesTimeZone}]`;


          // Backend "YYYY-MM-DD HH:mm:ss.ffffff" (or without fractional seconds)
          // - remove fractional seconds
          // - replace space with 'T'
          const noFraction = raw.split(".")[0];
          if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(noFraction)) {
            const withT = noFraction.replace(" ", "T");
            return `${withT}+08:00[${philippinesTimeZone}]`;
          }

          // ISO without timezone, like "YYYY-MM-DDTHH:mm:ss"
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(noFraction)) {
            return `${noFraction}+08:00[${philippinesTimeZone}]`;
          }

          // Date-only -> treat as start of day in PH
          if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            return `${raw}T00:00:00+08:00[${philippinesTimeZone}]`;
          }  

          throw new Error(`Unrecognized date format: "${value}"`);
        };

        const startZoned = Temporal.ZonedDateTime.from(toScheduleXTemporalString(event.start));
        const endZoned = Temporal.ZonedDateTime.from(toScheduleXTemporalString(event.end));

        return {
          id: event.id.toString(),
          title: event.title,
          start: startZoned,
          end: endZoned,
        };
      } catch (error) {
        console.error("Error parsing event dates:", error, event);
        return null;
      }
    }).filter((event) => event !== null);
  };

  const events = convertEventsToScheduleX();

  const onSubmit = async (data: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
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

      // Create event data for API
      const createEventData: CreateEvent = {
        title: data.title,
        start: formatDateTimeForDotNet(startDateTime),
        end: formatDateTimeForDotNet(endDateTime),
      };

      // Call the API
      await createEventMutation.mutateAsync(createEventData);

      // Reset form and close modal
      reset({
        title: "",
        date: today.toString(),
        startTime: "",
        endTime: "",
      });
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleOpenCreate = () => {
    reset({
      title: "",
      date: today.toString(),
      startTime: "",
      endTime: "",
    });
    onOpen();
  };

  const calendar = useCalendarApp({
    defaultView: "week",
    views: [createViewWeek(), createViewMonthGrid()],
    selectedDate: today,
    events: events,
    locale: "en-US",
    timezone: philippinesTimeZone,
  });

  // Update calendar events when events state changes
  useEffect(() => {
    if (calendar) {
      calendar.events.set(events);
    }
  }, [events, calendar]);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Button colorScheme="blue" onClick={handleOpenCreate}>
          Add New Task
        </Button>
      </div>

      <ScheduleXCalendar calendarApp={calendar} />

      {/* Add Task Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Add New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.title} isRequired>
                  <FormLabel>Task Title</FormLabel>
                  <Input
                    {...register("title", { required: "Task title is required" })}
                    placeholder="Enter task title"
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
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={createEventMutation.isPending}
              >
                Create Task
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Home;

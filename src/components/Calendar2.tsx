import { useState, useEffect } from "react";
import { useCalendarApp } from "@schedule-x/react";
import { ScheduleXCalendar } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { Temporal } from "temporal-polyfill";
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
} from "@chakra-ui/react";

const Calendar2 = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  // Get current time in Philippines timezone (Asia/Manila, UTC+8)
  const philippinesTimeZone = "Asia/Manila";
  const now = Temporal.Now.zonedDateTimeISO(philippinesTimeZone);
  const today = now.toPlainDate();

  // State to store events
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Task 1",
      start: today.toZonedDateTime(philippinesTimeZone).with({ hour: 9, minute: 0 }),
      end: today.toZonedDateTime(philippinesTimeZone).with({ hour: 10, minute: 0 }),
    },
    {
      id: "2",
      title: "Task 2",
      start: today.toZonedDateTime(philippinesTimeZone).with({ hour: 14, minute: 30 }),
      end: today.toZonedDateTime(philippinesTimeZone).with({ hour: 16, minute: 0 }),
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      alert("Please fill in all fields");
      return;
    }

    // Parse date and time
    const [startHour, startMinute] = formData.startTime.split(":").map(Number);
    const [endHour, endMinute] = formData.endTime.split(":").map(Number);
    const selectedDate = Temporal.PlainDate.from(formData.date);

    // Create new event
    const newEvent = {
      id: Date.now().toString(),
      title: formData.title,
      start: selectedDate.toZonedDateTime(philippinesTimeZone).with({ hour: startHour, minute: startMinute }),
      end: selectedDate.toZonedDateTime(philippinesTimeZone).with({ hour: endHour, minute: endMinute }),
    }; 

    // Add to events list
    setEvents((prev) => [...prev, newEvent]);

    // Reset form and close modal
    setFormData({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
    });
    onClose();
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

  // Get today's date in YYYY-MM-DD format for default value
  const todayString = today.toString();

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Button colorScheme="blue" onClick={onOpen}>
          Add New Task
        </Button>
      </div>

      <ScheduleXCalendar calendarApp={calendar} />

      {/* Add Task Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Add New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Task Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    defaultValue={todayString}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit">
                Create Task
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Calendar2;

import { useState } from "react";
import { Calendar as BigCalendar, View, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
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
  Textarea,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, AddIcon } from "@chakra-ui/icons";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Task } from "../entiies/Task";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

interface CalendarProps {
  tasks?: Task[];
  onTaskCreate?: (task: Omit<Task, "id">) => void;
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
}

const Calendar = ({ tasks: externalTasks, onTaskCreate, onTaskUpdate, onTaskDelete }: CalendarProps) => {
  // Internal task state - use this if no external tasks provided
  const [internalTasks, setInternalTasks] = useState<Task[]>([]);
  
  // Use external tasks if provided, otherwise use internal state
  const tasks = externalTasks !== undefined ? externalTasks : internalTasks;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("week");
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Convert tasks to calendar events
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.start),
    end: new Date(task.end),
    resource: task,
  }));

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPrevious = () => {
    if (view === "week") {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else if (view === "day") {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
    }
  };

  const goToNext = () => {
    if (view === "week") {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else if (view === "day") {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setTaskForm({
      title: "",
      description: "",
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setSelectedTask(null);
    onOpen();
  };

  const handleSelectEvent = (event: any) => {
    const task = event.resource as Task;
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      start: new Date(task.start),
      end: new Date(task.end),
    });
    setSelectedSlot(null);
    onOpen();
  };

  const handleSaveTask = () => {
    if (!taskForm.title.trim()) {
      return;
    }

    if (selectedTask) {
      // Update existing task
      const updatedTask: Task = {
        ...selectedTask,
        title: taskForm.title,
        description: taskForm.description,
        start: taskForm.start,
        end: taskForm.end,
      };
      
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      } else {
        // Update in internal state
        setInternalTasks(internalTasks.map((task) => (task.id === selectedTask.id ? updatedTask : task)));
      }
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskForm.title,
        description: taskForm.description,
        start: taskForm.start,
        end: taskForm.end,
        completed: false,
        createdAt: new Date(),
      };
      
      if (onTaskCreate) {
        onTaskCreate({
          title: taskForm.title,
          description: taskForm.description,
          start: taskForm.start,
          end: taskForm.end,
          completed: false,
        });
      } else {
        // Add to internal state
        setInternalTasks([...internalTasks, newTask]);
      }
    }

    onClose();
    setTaskForm({
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
    });
    setSelectedTask(null);
    setSelectedSlot(null);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      if (onTaskDelete) {
        onTaskDelete(selectedTask.id);
      } else {
        // Delete from internal state
        setInternalTasks(internalTasks.filter((task) => task.id !== selectedTask.id));
      }
      onClose();
      setSelectedTask(null);
    }
  };

  const eventStyleGetter = (event: any) => {
    const task = event.resource as Task;
    return {
      style: {
        backgroundColor: task.completed ? "#48BB78" : "#3182CE",
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <>
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
        p={6}
        fontFamily="geist"
        w="100%"
        h="100%"
        minH="600px"
      >
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading fontSize="xl" fontWeight="bold">
            {format(currentDate, "MMMM yyyy", { locale: enUS })}
          </Heading>
          <Flex gap={2} alignItems="center">
            <Button
              leftIcon={<AddIcon />}
              size="sm"
              colorScheme="blue"
              onClick={() => {
                setSelectedSlot(null);
                setSelectedTask(null);
                setTaskForm({
                  title: "",
                  description: "",
                  start: new Date(),
                  end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
                });
                onOpen();
              }}
            >
              New Task
            </Button>
            <Button size="sm" variant="ghost" onClick={goToToday}>
              Today
            </Button>
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon />}
              size="sm"
              variant="ghost"
              onClick={goToPrevious}
            />
            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon />}
              size="sm"
              variant="ghost"
              onClick={goToNext}
            />
            <Button
              size="sm"
              variant={view === "day" ? "solid" : "ghost"}
              colorScheme="blue"
              onClick={() => setView("day")}
              ml={2}
            >
              Day
            </Button>
            <Button
              size="sm"
              variant={view === "week" ? "solid" : "ghost"}
              colorScheme="blue"
              onClick={() => setView("week")}
            >
              Week
            </Button>
          </Flex>
        </Flex>

        {/* Calendar */}
        <Box h="600px">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            view={view}
            onView={setView}
            date={currentDate}
            onNavigate={handleNavigate}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            defaultView="week"
            min={new Date(1970, 0, 1, 0, 0, 0)}
            max={new Date(1970, 0, 1, 23, 59, 59)}
            step={60}
            timeslots={1}
            formats={{
              dayFormat: "EEE",
              timeGutterFormat: "ha",
            }}
          />
        </Box>
      </Box>

      {/* Task Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedTask ? "Edit Task" : "Create Task"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Task Title</FormLabel>
              <Input
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Enter task title"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Enter task description (optional)"
                rows={3}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                value={format(taskForm.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    start: new Date(e.target.value),
                  })
                }
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                value={format(taskForm.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    end: new Date(e.target.value),
                  })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {selectedTask && (
              <Button colorScheme="red" variant="ghost" mr={3} onClick={handleDeleteTask}>
                Delete
              </Button>
            )}
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveTask}>
              {selectedTask ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Calendar;

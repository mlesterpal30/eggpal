import { useState } from "react";
import { Box } from "@chakra-ui/react";
import Calendar from "./Calendar";
import { Task } from "../entiies/Task";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskCreate = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <Box p={6}>
      <Calendar
        tasks={tasks}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </Box>
  );
};

export default Tasks;


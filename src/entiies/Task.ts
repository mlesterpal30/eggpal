export interface Task {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  completed?: boolean;
  createdAt?: Date;
}


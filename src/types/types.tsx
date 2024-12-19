export interface Task {
    id?: number;
    name: string;
    description: string;
    dueDate: Date;
    createDate?: Date;
  }
  
  export type TaskStatus = 'not urgent' | 'due soon' | 'overdue';
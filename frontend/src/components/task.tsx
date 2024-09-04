"use client";

import { Draggable } from "@hello-pangea/dnd";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardHeader,
  Badge,
} from "@/components";
import { ITask } from "@/interfaces";

type Props = {
  task: ITask;
  index: number;
};

const Task = ({ task, index }: Props) => {
  return (
    <Draggable draggableId={`task-${String(task.id)}`} index={index}>
      {(provided) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <CardHeader className="flex flex-row items-center gap-3 p-3">
            <div className="flex-1">
              <h3 className="text-sm font-medium leading-none mb-3">
                {task.content}
              </h3>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs p-1">
                  Frontend
                </Badge>
                <Badge variant="outline" className="text-xs p-1">
                  High Priority
                </Badge>
              </div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage alt="Johb Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </CardHeader>
        </Card>
      )}
    </Draggable>
  );
};

export default Task;

"use client";

import { Draggable } from "@hello-pangea/dnd";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardHeader,
  Badge,
} from "@/components/ui";
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
              <div className="bg-inherit font-medium leading-none mb-3 text-sm outline-none w-full">
                {task.content}
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  Frontend
                </Badge>
                <Badge variant="outline" className="text-xs">
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

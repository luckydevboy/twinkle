"use client";

import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardHeader,
  Badge,
  Dialog,
  DialogTrigger,
  DialogContent,
  Input,
  Button,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components";
import { ITask } from "@/interfaces";
import { useDeleteTask } from "@/services";

type Props = {
  task: ITask;
  index: number;
};

const Task = ({ task, index }: Props) => {
  const [title, setTitle] = useState(task.content);
  const deleteTask = useDeleteTask();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    deleteTask.mutateAsync(task.id).then(() => {
      queryClient.invalidateQueries({ queryKey: ["boards", 1] });
    });
  };

  return (
    <Dialog>
      <Draggable draggableId={`task-${String(task.id)}`} index={index}>
        {(provided) => (
          <DialogTrigger className="w-full">
            <Card
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <CardHeader className="flex flex-row items-center gap-3 p-3">
                <div className="flex-1">
                  <div className="bg-inherit font-medium leading-none mb-3 text-sm outline-none w-full text-left">
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
          </DialogTrigger>
        )}
      </Draggable>

      <DialogContent>
        <div className="mt-6">
          <Input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Task name"
          />
          <div className="flex justify-between my-6 gap-x-4">
            <div className="w-full">
              <Textarea
                placeholder="Description"
                className="w-full resize-none"
                rows={3}
                disabled
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Popover>
                <PopoverTrigger>
                  <Button variant="secondary">Delete</Button>
                </PopoverTrigger>
                <PopoverContent>
                  Are you sure want to delete that?
                  <Button
                    className="w-full mt-4"
                    variant="destructive"
                    isLoading={deleteTask.isPending}
                    disabled={deleteTask.isPending}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>

              <Button variant="secondary" disabled>
                Assign
              </Button>
              <Button variant="secondary" disabled>
                Tags
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Task;

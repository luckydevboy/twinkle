"use client";

import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "@radix-ui/react-icons";
import { cx } from "class-variance-authority";
import { useParams } from "next/navigation";

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
  Separator,
} from "@/components";
import { ITask } from "@/interfaces";
import { useAssignUserToTask, useDeleteTask, useGetUsers } from "@/services";

type Props = {
  task: ITask;
  index: number;
};

const Task = ({ task, index }: Props) => {
  const [title, setTitle] = useState(task.content);
  const deleteTask = useDeleteTask();
  const queryClient = useQueryClient();
  const { data: users } = useGetUsers();
  const assignUserToTask = useAssignUserToTask();
  const params = useParams();

  const handleDelete = () => {
    deleteTask.mutateAsync(task.id).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["boards", Number(params.id)],
      });
    });
  };

  const handleAssign = (userId: number) => {
    assignUserToTask.mutateAsync({ taskId: task.id, userId }).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["boards", Number(params.id)],
      });
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
                {task.user?.firstName && (
                  <Avatar>
                    <AvatarImage
                      alt={task.user.firstName + " " + task.user.lastName}
                    />
                    <AvatarFallback>
                      {task.user.firstName[0]}
                      {task.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
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
                className="w-full resize-none h-full"
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

              <Popover>
                <PopoverTrigger>
                  <Button variant="secondary">Assign</Button>
                </PopoverTrigger>
                <PopoverContent className="space-y-2 p-2">
                  {users?.map((user, index) => (
                    <>
                      {index !== 0 && <Separator />}
                      <div key={user.id} className="flex gap-x-2 items-center">
                        <Avatar
                          className={cx([
                            "relative cursor-pointer",
                            user.id === task.user?.id &&
                              "border border-dashed border-primary/50",
                            assignUserToTask.isPending && "animate-pulse",
                          ])}
                          onClick={() => handleAssign(user.id)}
                        >
                          {user.id === task.user?.id && (
                            <>
                              <div className="absolute inset-0 bg-background/80"></div>
                              <CheckIcon className="w-6 h-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </>
                          )}
                          <AvatarImage
                            alt={user.firstName + " " + user.lastName}
                          />
                          <AvatarFallback>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </>
                  ))}
                </PopoverContent>
              </Popover>

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

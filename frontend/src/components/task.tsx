"use client";

import { Draggable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { SyntheticEvent, useState } from "react";
import {
  TrashIcon,
  UserIcon,
  PencilIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardHeader,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components";
import { ITask } from "@/interfaces";
import { useDeleteTask, useEditTask } from "@/api";

type Props = {
  task: ITask;
  index: number;
};

const Task = ({ task, index }: Props) => {
  const deleteTask = useDeleteTask();
  const editTask = useEditTask();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);

  const handleDelete = () => {
    deleteTask.mutateAsync(task.id).then(() => {
      queryClient.invalidateQueries({ queryKey: ["boards", 1] });
    });
  };

  const handleEdit = (e: SyntheticEvent) => {
    e.preventDefault();
    editTask.mutateAsync({ id: task.id, content: content }).then(() => {
      setIsEditing(false);
    });
  };

  return (
    <Dialog>
      <Draggable draggableId={`task-${String(task.id)}`} index={index}>
        {(provided) => (
          <div>
            <ContextMenu>
              <ContextMenuTrigger>
                <Card
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  <CardHeader className="flex flex-row items-center gap-3 p-3">
                    <div className="flex-1">
                      <form className="relative" onSubmit={handleEdit}>
                        <input
                          className={clsx([
                            "bg-inherit font-medium leading-none mb-3 text-sm outline-none w-full",
                            isEditing && "border-primary border-b",
                          ])}
                          value={content}
                          disabled={!isEditing}
                          type="text"
                          onChange={({ target }) => setContent(target.value)}
                        />
                        {isEditing &&
                          // FIXME: isPending doesn't work
                          (editTask.isPending ? (
                            <svg
                              className="animate-spin h-4 w-4 text-white absolute top-1 right-0"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <button
                              type="submit"
                              className="absolute top-1 right-0"
                            >
                              <CheckIcon className="w-4 h-4 text-primary" />
                            </button>
                          ))}
                      </form>
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
              </ContextMenuTrigger>
              <ContextMenuContent>
                <DialogTrigger asChild>
                  <ContextMenuItem className="flex items-center justify-between">
                    <div>Delete</div>
                    <TrashIcon className="text-primary h-4 w-4" />
                  </ContextMenuItem>
                </DialogTrigger>
                <ContextMenuItem
                  className="flex items-center justify-between"
                  onClick={() => setIsEditing(true)}
                >
                  <div>Edit</div>
                  <PencilIcon className="text-primary h-4 w-4" />
                </ContextMenuItem>
                <ContextMenuItem className="flex items-center justify-between">
                  <div>Assign</div>
                  <UserIcon className="text-primary h-4 w-4" />
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        )}
      </Draggable>

      {/* Delete dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure to delete the task?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the task
            and remove it from the server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary">Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Task;

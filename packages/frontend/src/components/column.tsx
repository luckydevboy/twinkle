"use client";

import { SyntheticEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { clsx } from "clsx";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Task,
} from "@/components/index";
import { IColumn, ITask } from "@/interfaces";
import { useCreateTask, useEditColumn } from "@/api";

type Props = {
  column: IColumn;
  tasks: ITask[];
  index: number;
};

const Column = ({ column, tasks, index }: Props) => {
  const [isAddingNewTask, setIsAddingNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [title, setTitle] = useState(column.title);
  const [isEditing, setIsEditing] = useState(false);
  const createTask = useCreateTask();
  const editColumn = useEditColumn();
  const queryClient = useQueryClient();

  const handleAddNewTask = (e: SyntheticEvent) => {
    e.preventDefault();

    createTask
      .mutateAsync({
        columnId: column.id,
        name: newTaskTitle,
        order: tasks.length + 1,
      })
      .then(() => {
        handleClose();
        // TODO: make id to be dynamic
        queryClient.invalidateQueries({ queryKey: ["boards", 1] });
      });
  };

  const handleEdit = (e: SyntheticEvent) => {
    e.preventDefault();
    editColumn.mutateAsync({ columnId: column.id, name: title }).then(() => {
      setIsEditing(false);
    });
  };

  const handleClose = () => {
    setNewTaskTitle("");
    setIsAddingNewTask(false);
  };

  return (
    <Draggable draggableId={String(column.id)} index={index}>
      {(provided) => (
        <Card
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="w-80 flex-shrink-0 h-fit"
        >
          <CardHeader {...provided.dragHandleProps}>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <form className="relative" onSubmit={handleEdit}>
                  <input
                    className={clsx([
                      "bg-inherit font-semibold leading-none text-lg outline-none",
                      isEditing && "border-primary border-b",
                    ])}
                    style={{ width: `${title.length + (isEditing ? 2 : 0)}ch` }}
                    value={title}
                    disabled={!isEditing}
                    type="text"
                    onChange={({ target }) => setTitle(target.value)}
                  />
                  {isEditing &&
                    // FIXME: isPending doesn't work
                    // TODO: Make the svg a component
                    (editColumn.isPending ? (
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
                      <button type="submit" className="absolute top-1 right-0">
                        <CheckIcon className="w-4 h-4 text-primary" />
                      </button>
                    ))}
                </form>
                <div className="w-6 h-6 text-xs rounded-full bg-secondary text-primary flex items-center justify-center">
                  {tasks.length}
                </div>
              </div>
              <Popover>
                <PopoverTrigger>
                  <EllipsisHorizontalIcon className="w-6 h-6 text-primary" />
                </PopoverTrigger>
                <PopoverContent className="w-32 p-1">
                  <div
                    className="flex items-center justify-between text-sm hover:bg-accent hover:text-accent-foreground px-1.5 py-2 h-8 rounded-md cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    <div>Edit</div>
                    <PencilIcon className="text-primary h-4 w-4" />
                  </div>
                </PopoverContent>
              </Popover>
            </CardTitle>
          </CardHeader>
          <Droppable droppableId={`column-${String(column.id)}`} type="task">
            {(provided) => (
              <CardContent
                className="space-y-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
                {isAddingNewTask ? (
                  <form onSubmit={handleAddNewTask} className="mt-1">
                    <Input
                      value={newTaskTitle}
                      onChange={({ target }) => setNewTaskTitle(target.value)}
                      placeholder="Enter yout task here..."
                    />
                    <div className="flex items-center gap-x-3 mt-3">
                      <Button disabled={!newTaskTitle} type="submit">
                        Add task
                      </Button>
                      <XMarkIcon
                        className="w-5 h-5 text-zinc-500 cursor-pointer"
                        onClick={handleClose}
                      />
                    </div>
                  </form>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsAddingNewTask(true)}
                  >
                    Add new task
                  </Button>
                )}
              </CardContent>
            )}
          </Droppable>
        </Card>
      )}
    </Draggable>
  );
};

export default Column;

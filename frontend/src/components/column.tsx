"use client";

import { SyntheticEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { EllipsisHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Task,
} from "@/components";
import { IColumn, ITask } from "@/interfaces";
import { useCreateTask } from "@/api";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  column: IColumn;
  tasks: ITask[];
  index: number;
};

const Column = ({ column, tasks, index }: Props) => {
  const [isAddingNewTask, setIsAddingNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const createTask = useCreateTask();
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
          className="w-96 flex-shrink-0 max-h-[calc(100vh-68px-16px-16px)]"
        >
          <CardHeader {...provided.dragHandleProps}>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <h2 className="">{column.title}</h2>
                <div className="w-6 h-6 text-xs rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center">
                  {tasks.length}
                </div>
              </div>
              <EllipsisHorizontalIcon className="w-6 h-6 text-zinc-400" />
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

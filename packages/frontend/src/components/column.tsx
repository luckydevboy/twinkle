"use client";

import { SyntheticEvent, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cx } from "class-variance-authority";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Task,
} from "@/components";
import { IColumn, ITask } from "@/interfaces";
import { useCreateTask, useDeleteColumn, useEditColumn } from "@/services";

type Props = {
  column: IColumn;
  tasks: ITask[];
  index: number;
};

const Column = ({ column, tasks, index }: Props) => {
  const [isAddingNewTask, setIsAddingNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [title, setTitle] = useState(column.title);
  const createTask = useCreateTask();
  const editColumn = useEditColumn();
  const queryClient = useQueryClient();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const deleteColumn = useDeleteColumn();

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
        queryClient.invalidateQueries({ queryKey: ["boards", 1] });
      });
  };

  const handleEdit = (e: SyntheticEvent) => {
    e.preventDefault();
    editColumn.mutateAsync({ columnId: column.id, name: title }).then(() => {
      if (titleInputRef.current) {
        titleInputRef.current.blur();
      }
    });
  };

  const handleClose = () => {
    setNewTaskTitle("");
    setIsAddingNewTask(false);
  };

  const handleDelete = () => {
    deleteColumn.mutateAsync(column.id).then(() => {
      queryClient.invalidateQueries({ queryKey: ["boards", 1] });
    });
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
            <CardTitle className="flex items-center justify-between pr-2">
              <div className="flex items-center justify-between gap-x-4 w-full">
                <form className="relative w-full" onSubmit={handleEdit}>
                  <Input
                    ref={titleInputRef}
                    className={cx([
                      "border-transparent font-bold text-md outline-none w-full focus:border-secondary",
                    ])}
                    value={title}
                    type="text"
                    onChange={({ target }) => setTitle(target.value)}
                  />
                </form>
                <div className="flex items-center gap-x-2">
                  <div className="w-6 h-6 text-xs flex-shrink-0 rounded-full bg-secondary text-primary flex items-center justify-center">
                    {tasks.length}
                  </div>
                  <Popover>
                    <PopoverContent className="max-w-32 p-1.5">
                      <Dialog>
                        <DialogTrigger className="w-full">
                          <div className="p-1.5 hover:bg-secondary text-sm rounded-sm cursor-pointer text-left">
                            Delete
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete column</DialogTitle>
                          </DialogHeader>
                          Are you sure want to delete this column? All related
                          tasks will be deleted too!
                          <div className="flex gap-x-2 justify-end">
                            <DialogClose>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                              disabled={deleteColumn.isPending}
                              isLoading={deleteColumn.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </PopoverContent>
                    <PopoverTrigger>
                      <DotsVerticalIcon />
                    </PopoverTrigger>
                  </Popover>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <Droppable droppableId={`column-${String(column.id)}`} type="task">
            {(provided) => (
              <ScrollArea className="flex flex-col max-h-[calc(100vh-192px)]">
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
              </ScrollArea>
            )}
          </Droppable>
        </Card>
      )}
    </Draggable>
  );
};

export default Column;

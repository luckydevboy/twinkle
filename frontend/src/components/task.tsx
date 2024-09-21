"use client";

import { Draggable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardHeader,
  Badge,
  Button,
} from "@/components";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ITask } from "@/interfaces";
import { TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useDeleteTask } from "@/api";

type Props = {
  task: ITask;
  index: number;
};

const Task = ({ task, index }: Props) => {
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
                      <h3 className="text-sm font-medium leading-none mb-3">
                        {task.content}
                      </h3>
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
                <ContextMenuItem className="flex items-center justify-between">
                  <div>Edit</div>
                  <Pencil1Icon className="text-primary h-4 w-4" />
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

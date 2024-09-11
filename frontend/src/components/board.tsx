"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { IBoard, IColumn } from "@/interfaces";
import { Button, Card, CardHeader, Column, Input } from "@/components";
import {
  useCreateColumn,
  useMoveTaskToAnotherColumn,
  useReorderColumns,
  useReorderTasksInColumn,
} from "@/api";

type Props = {
  board: IBoard;
};

const Board = ({ board }: Props) => {
  const [state, setState] = useState(board);
  const [isAddingNewColumn, setIsAddingNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const reorderColumns = useReorderColumns();
  const reorderTasksInColumns = useReorderTasksInColumn();
  const moveTaskToAnotherColumn = useMoveTaskToAnotherColumn();
  const createColumn = useCreateColumn();

  useEffect(() => {
    setState(board);
  }, [board]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    const sourceDroppableId = source.droppableId.split("-")[1];
    const destinationDroppableId = destination?.droppableId.split("-")[1];

    if (!destination) {
      return;
    }

    if (
      destinationDroppableId === sourceDroppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, Number(draggableId));

      const newState: IBoard = {
        ...state,
        columnOrder: newColumnOrder,
      };

      setState(newState);

      reorderColumns.mutateAsync({
        boardId: state.id,
        columnIds: newState.columnOrder,
      });
    }

    if (destinationDroppableId) {
      const startColumn = state.columns[sourceDroppableId];
      const finishColumn = state.columns[destinationDroppableId];

      if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, Number(draggableId));

        const newColumn: IColumn = {
          ...startColumn,
          taskIds: newTaskIds,
        };

        const newState: IBoard = {
          ...state,
          columns: {
            ...state.columns,
            [newColumn.id]: newColumn,
          },
        };

        setState(newState);

        reorderTasksInColumns.mutateAsync({
          columnId: startColumn.id,
          taskIds: newTaskIds,
        });

        return;
      }

      // Moving from one list to another
      const startTasksIds = Array.from(startColumn.taskIds);
      startTasksIds.splice(source.index, 1);
      const newStartColumn: IColumn = {
        ...startColumn,
        taskIds: startTasksIds,
      };

      const finishTaskIds = Array.from(finishColumn.taskIds);
      finishTaskIds.splice(destination.index, 0, Number(draggableId));
      const newFinishColumn: IColumn = {
        ...finishColumn,
        taskIds: finishTaskIds,
      };

      const newState: IBoard = {
        ...state,
        columns: {
          ...state.columns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn,
        },
      };
      setState(newState);

      moveTaskToAnotherColumn.mutateAsync({
        taskId: Number(draggableId),
        newColumnId: newFinishColumn.id,
        position: destination.index,
      });
    }
  };

  const handleAddNewColumn = (e: SyntheticEvent) => {
    e.preventDefault();
    createColumn
      .mutateAsync({
        boardId: board.id,
        name: newColumnTitle,
        order: board.columnOrder.length + 1,
      })
      .then((res) => {
        setState({
          ...state,
          columns: {
            ...state.columns,
            [res.data.id]: {
              taskIds: [],
              id: res.data.id,
              title: res.data.name,
            },
          },
          columnOrder: [...state.columnOrder, res.data.id],
        });
        handleClose();
      });
  };

  const handleClose = () => {
    setNewColumnTitle("");
    setIsAddingNewColumn(false);
  };

  return (
    <div className="flex p-4 gap-x-10 overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="flex gap-x-10"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {state.columnOrder.map((columnId, index) => {
                const column = state.columns[columnId];
                const tasks = column.taskIds.map(
                  (taskId) => state.tasks[taskId],
                );

                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {isAddingNewColumn ? (
        <Card className="w-96 h-fit flex-shrink-0">
          <CardHeader>
            <form className="space-y-3" onSubmit={handleAddNewColumn}>
              <Input
                placeholder="Enter column name..."
                value={newColumnTitle}
                onChange={({ target }) => setNewColumnTitle(target.value)}
                autoFocus={isAddingNewColumn}
              />
              <div className="flex items-center gap-x-3">
                <Button className="" disabled={!newColumnTitle}>
                  Add
                </Button>
                <XMarkIcon
                  className="w-5 h-5 text-zinc-500 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
            </form>
          </CardHeader>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="flex-shrink-0"
          onClick={() => setIsAddingNewColumn(true)}
        >
          Add new column
        </Button>
      )}
    </div>
  );
};

export default Board;

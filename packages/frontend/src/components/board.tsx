"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { IBoard, IColumn } from "@/interfaces";
import { Button, Card, CardHeader, Column, Input } from "@/components/index";
import {
  useCreateColumn,
  useMoveTaskToAnotherColumn,
  useReorderColumns,
  useReorderTasksInColumn,
} from "@/services";

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
      return;
    }

    if (destinationDroppableId) {
      const startColumn = state.columns[sourceDroppableId];
      const finishColumn = state.columns[destinationDroppableId];

      const _draggableId = Number(draggableId.split("-")[1]);

      // Reorder task in a column
      if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, Number(_draggableId));

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
      finishTaskIds.splice(destination.index, 0, _draggableId);
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
        taskId: _draggableId,
        newColumnId: newFinishColumn.id,
        newPosition: destination.index + 1,
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
    <div className="flex overflow-x-auto">
      {state.columnOrder.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <div
                className="flex gap-x-4 px-4"
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
      ) : (
        <></>
      )}
      <div className={state.columnOrder.length === 0 ? "px-4" : ""}>
        {isAddingNewColumn ? (
          <Card className="w-80 h-fit flex-shrink-0">
            <CardHeader>
              <form className="space-y-3" onSubmit={handleAddNewColumn}>
                <Input
                  placeholder="Enter column name..."
                  value={newColumnTitle}
                  onChange={({ target }) => setNewColumnTitle(target.value)}
                  autoFocus={isAddingNewColumn}
                />
                <div className="flex items-center gap-x-3">
                  <Button disabled={!newColumnTitle}>Add</Button>
                  <XMarkIcon
                    className="w-5 h-5 text-zinc-500 cursor-pointer"
                    onClick={handleClose}
                  />
                </div>
              </form>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-2">
            {state.columnOrder.length === 0 && (
              <div>Create your first column 🚀</div>
            )}
            <Button
              variant="outline"
              className="flex-shrink-0"
              onClick={() => setIsAddingNewColumn(true)}
            >
              Add new column
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;

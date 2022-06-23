import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IToDo, toDoState } from "../atoms";
import DragabbledCard from "./DragabbleCard";

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface IBoard {
  toDos: IToDo[];
  boardId: string;
  index: number;
}

interface IForm {
  toDo: string;
}

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  padding: 10px 0px;
  min-height: 200px;
  border-radius: 5px;
  min-height: 300px;
  width: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  input {
    width: 95%;
    border: none;
    padding: 5px 0px;
    border-radius: 5px;
    text-align: center;
  }
`;

const Area = styled.div<IAreaProps>`
  // isDraggingOver is boolean and it's from snapshot. it will check if mouse is on the board or not
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#FEECE8"
      : props.isDraggingFromThis
      ? "#EAE6FE"
      : props.theme.boardColor};
  flex-grow: 1;
  // flex-container 요소 내부에서 할당 가능한 공간의 정도를 선언합니다.
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
  border-radius: 5px;
`;

function Board({ toDos, boardId, index }: IBoard) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Math.floor(Date.now()),
      text: toDo,
    };
    setToDos((allBoard) => {
      return {
        ...allBoard,
        [boardId]: [...allBoard[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };
  return (
    <Draggable index={index} draggableId={boardId} key={boardId}>
      {(provide) => (
        <Wrapper
          ref={provide.innerRef}
          {...provide.draggableProps}
          {...provide.dragHandleProps}
        >
          <Title>{boardId}</Title>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: "plz write down" })}
              type="text"
              placeholder={`New Todo`}
            />
          </Form>
          <Droppable droppableId={boardId}>
            {(provide, snapshot) => (
              <Area
                isDraggingOver={snapshot.isDraggingOver}
                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                ref={provide.innerRef}
                //reference is how we can point or grab HTML elements with react code
                {...provide.droppableProps}
              >
                {toDos.map((toDo, index) => (
                  <DragabbledCard
                    key={toDo.id}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                    index={index}
                  />
                ))}
                {provide.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Board);

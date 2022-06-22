import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const Delete = styled.div<{ isDraggingOverforTrash: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e4e7ed;
  position: fixed;
  right: 30px;
  bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s ease-in-out;
  &:hover {
    transform: scale(1.4);
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

function Board({ toDos, boardId }: IBoard) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
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
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: "plz write down" })}
          type="text"
          placeholder={`New Todo`}
        />
      </Form>
      <Droppable droppableId={"container"}>
        {(provide, snapshot) => (
          <>
            <div ref={provide.innerRef}>
              <Draggable index={1} draggableId={"wrapper"}>
                {(provide, snapshot) => (
                  <Container
                    ref={provide.innerRef}
                    {...provide.draggableProps}
                    {...provide.dragHandleProps}
                  >
                    <Droppable droppableId={boardId}>
                      {(provide, snapshot) => (
                        <Area
                          isDraggingOver={snapshot.isDraggingOver}
                          isDraggingFromThis={Boolean(
                            snapshot.draggingFromThisWith
                          )}
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
                  </Container>
                )}
              </Draggable>
            </div>
            {provide.placeholder}
          </>
        )}
      </Droppable>

      <Droppable droppableId={"trash"}>
        {(provide, snapshot) => (
          <>
            <Delete
              ref={provide.innerRef}
              {...provide.droppableProps}
              isDraggingOverforTrash={snapshot.isDraggingOver}
            >
              <FontAwesomeIcon icon={faTrashCan} size={"lg"} />
            </Delete>
            {provide.placeholder}
          </>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;

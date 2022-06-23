import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { boardState, toDoState } from "./atoms";
import Board from "./components/Board";
import "./FontAwesome";

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

const Boards = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

function App() {
  const [boards, setBoards] = useRecoilState(boardState);
  const [toDos, setToDos] = useRecoilState(toDoState);
  console.log(boards);
  const onDragEnd = (info: DropResult) => {
    const { destination, source, draggableId } = info;
    if (!destination) return;
    if (source.droppableId === "boards") {
      setBoards((prev) => {
        const copy = [...prev];
        copy.splice(source.index, 1);
        copy.splice(destination.index, 0, draggableId);
        return copy;
      });
    } else if (destination?.droppableId === source.droppableId) {
      setToDos((allBorad) => {
        const boardCopy = [...allBorad[source.droppableId]];
        console.log("copy", boardCopy);
        const taskObj = boardCopy[source.index];
        console.log("obj", taskObj);
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBorad,
          [source.droppableId]: boardCopy,
          //객체 안에서 키 값이 중복된 프로퍼티는 마지막에 선언된 프로퍼티를 사용하기때문에 저렇게 넣어줘도 상관없다
          // key 값에 변수를 넣기 위해 [source.droppableId]: boardCopy 대괄호를 사용함
        };
      });
    } else if (destination.droppableId === "trash") {
      setToDos((allBorad) => {
        const boardCopy = [...allBorad[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return {
          ...allBorad,
          [source.droppableId]: boardCopy,
        };
      });
    } else if (
      destination.droppableId !== source.droppableId ||
      destination.droppableId !== "trash"
    ) {
      setToDos((allBoard) => {
        const sourceBoard = [...allBoard[source.droppableId]];
        // which board is selected from (where the movement start)
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoard[destination.droppableId]];
        // get board id where the movement finished
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoard,
          [source.droppableId]: sourceBoard,
          // draggabledId 가 사라진 board
          [destination?.droppableId]: destinationBoard,
          // draggabledId 가 추가 된 board
        };
      });
    }
  };

  //onDraged is called when drag is finished
  //Droppable's & draggable's childeren should be a fun
  //Draggable id and key have to be same
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {
        <Container>
          <Droppable droppableId="boards" direction="horizontal" type="board">
            {(provide) => (
              <Boards ref={provide.innerRef} {...provide.droppableProps}>
                {boards.map((boardId, index) => (
                  <Board
                    boardId={boardId}
                    key={boardId}
                    toDos={toDos[boardId]}
                    index={index}
                  />
                ))}
                {provide.placeholder}
              </Boards>
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
        </Container>
      }
    </DragDropContext>
  );
}

export default App;

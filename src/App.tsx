import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./components/Board";
import "./FontAwesome";

import "./styles.css";

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-content: center;
`;

const Home = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBorad) => {
        const boardCopy = [...allBorad[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBorad,
          [source.droppableId]: boardCopy,
          //객체 안에서 키 값이 중복된 프로퍼티는 마지막에 선언된 프로퍼티를 사용하기때문에 저렇게 넣어줘도 상관없다
          // key 값에 변수를 넣기 위해 [source.droppableId]: boardCopy 대괄호를 사용함
        };
      });
    }
    if (destination.droppableId === "trash") {
      setToDos((allBorad) => {
        const boardCopy = [...allBorad[source.droppableId]];
        console.log(boardCopy);

        boardCopy.splice(source.index, 1);
        return {
          ...allBorad,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (
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
        <Home>
          <Droppable droppableId="home">
            {(p, s) => (
              <Boards>
                {Object.keys(toDos).map((boardId) => (
                  <Board
                    boardId={boardId}
                    key={boardId}
                    toDos={toDos[boardId]}
                  />
                ))}
              </Boards>
            )}
          </Droppable>
        </Home>
      }
    </DragDropContext>
  );
}

export default App;

import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div<{ isDragging: boolean }>`
  padding: 10px 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  border: ${(props) => (props.isDragging ? "3px solid #bcb5e2" : "none")};
  background-color: ${(props) =>
    props.isDragging ? "transparent" : props.theme.cardColor};
`;

interface IDragabbledCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DragabbledCard({ toDoId, toDoText, index }: IDragabbledCardProps) {
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(provide, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provide.innerRef}
          {...provide.draggableProps}
          {...provide.dragHandleProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbledCard);
// React.memo 를 통해 불필요한 render 을 최소화 함 (성능 최적화를 목적으로만 사용됨)

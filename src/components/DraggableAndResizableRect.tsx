import {
  AddedText,
  TextContainerPosition,
  TextContainerSize,
} from "@/customTypes";
import clsx from "clsx";
import { DraggableEventHandler } from "react-draggable";
import { Rnd, RndResizeCallback } from "react-rnd";

type Props = {
  addedText: AddedText;
  textContainerPosition: TextContainerPosition;
  textContainerSize: TextContainerSize;
  changeAddedText: (addedText: AddedText) => void;
  onDragStop: DraggableEventHandler;
  onResizeStop: RndResizeCallback;
};

const ResizableAndDraggableRect = ({
  addedText,
  textContainerPosition,
  textContainerSize,
  changeAddedText,
  onDragStop,
  onResizeStop,
}: Props) => {
  return (
    <Rnd
      ref={addedText.ref}
      size={{
        width: textContainerSize.width,
        height: textContainerSize.height,
      }}
      position={textContainerPosition}
      enableResizing={{
        left: true,
        right: true,
      }}
      dragAxis="x"
      bounds="parent"
      className={clsx(
        "bg-violet text-white flex items-center pl-2 cursor-move overflow-clip",
        addedText.isSelected && "border-1 border-white"
      )}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      onClick={() => changeAddedText({ ...addedText, isSelected: true })}
    >
      <p className="select-none"> {addedText.text}</p>
    </Rnd>
  );
};

export default ResizableAndDraggableRect;

import { useEffect, useRef } from "react";
import { Stage, Layer, Text, Transformer } from "react-konva";
import Konva from "konva";
import { AddedText } from "@/customTypes";
import { blueColor, violetColor } from "@/constants";

type Props = {
  stageSize: { width: number; height: number };
  addedText: AddedText;
  textNodeRef: React.RefObject<Konva.Text | null>;
  changeAddedText: (addedText: AddedText) => void;
};

type RotatedBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

const getCorner = (
  pivotX: number,
  pivotY: number,
  diffX: number,
  diffY: number,
  angle: number
) => {
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);
  angle += Math.atan2(diffY, diffX);
  const x = pivotX + distance * Math.cos(angle);
  const y = pivotY + distance * Math.sin(angle);
  return { x, y };
};

const getClientRect = (rotatedBox: RotatedBox) => {
  const { x, y, width, height, rotation: rad } = rotatedBox;

  const p1 = getCorner(x, y, 0, 0, rad);
  const p2 = getCorner(x, y, width, 0, rad);
  const p3 = getCorner(x, y, width, height, rad);
  const p4 = getCorner(x, y, 0, height, rad);

  const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
  const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
  const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
  const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

const konvaStyles = {
  anchorsColor: violetColor,
  borderColor: blueColor,
  strokeColor: blueColor,
  strokeWidth: 0.5,
};

const DraggableAndResizableText = ({
  textNodeRef: textRef,
  stageSize,
  addedText,
  changeAddedText,
}: Props) => {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
    }
  }, []);

  const boundBoxFunc = (oldBox: RotatedBox, newBox: RotatedBox) => {
    const box = getClientRect({
      x: newBox.x,
      y: newBox.y,
      width: newBox.width,
      height: newBox.height,
      rotation: 0,
    });

    const isOut =
      box.x < 0 ||
      box.y < 0 ||
      box.x + box.width > stageSize.width ||
      box.y + box.height > stageSize.height;

    if (isOut) {
      return oldBox;
    }
    return newBox;
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target as Konva.Text;
    const box = node.getClientRect();
    const absPos = node.getAbsolutePosition();
    const offsetX = box.x - absPos.x;
    const offsetY = box.y - absPos.y;

    const newAbsPos = { ...absPos };

    if (box.x < 0) {
      newAbsPos.x = -offsetX;
    }
    if (box.y < 0) {
      newAbsPos.y = -offsetY;
    }
    if (box.x + box.width > stageSize.width) {
      newAbsPos.x = stageSize.width - box.width - offsetX;
    }
    if (box.y + box.height > stageSize.height) {
      newAbsPos.y = stageSize.height - box.height - offsetY;
    }

    node.setAbsolutePosition(newAbsPos);
  };

  const handleOnTransform = () => {
    const node = textRef.current;
    if (node) {
      node.setAttrs({
        width: Math.max(node.width() * node.scaleX(), 20),
        height: Math.max(node.height() * node.scaleY(), 20),
        scaleX: 1,
        scaleY: 1,
      });
    }
  };

  const handleOnDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const x = e.target.getClientRect().x;
    const y = e.target.getClientRect().y;
    changeAddedText({ ...addedText, inVideoX: x, inVideoY: y });
  };

  return (
    <Stage width={stageSize.width} height={stageSize.height}>
      <Layer>
        <Text
          ref={(node) => {
            if (node) {
              textRef.current = node;
            }
          }}
          x={0}
          y={0}
          text={addedText.text}
          fontSize={addedText.fontSize}
          width={200}
          draggable={addedText.isSelected}
          onDragMove={handleDragMove}
          onDragEnd={handleOnDragEnd}
          onTransform={handleOnTransform}
          fill={"white"}
        />
        <Transformer
          ref={trRef}
          boundBoxFunc={boundBoxFunc}
          enabledAnchors={!addedText.isSelected ? [] : undefined}
          borderEnabled={!addedText.isSelected ? false : true}
          rotateEnabled={addedText.isSelected}
          anchorStyleFunc={(anchor) => {
            anchor.fill(konvaStyles.anchorsColor);
            anchor.strokeWidth(konvaStyles.strokeWidth);
            anchor.stroke(konvaStyles.strokeColor);
          }}
          borderStroke={konvaStyles.borderColor}
        />
      </Layer>
    </Stage>
  );
};

export default DraggableAndResizableText;

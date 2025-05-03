import { supportedFiles } from "@/constants";
import { onDropType } from "@/customTypes";
import Dropzone from "shadcn-dropzone";
import ButtonWithIcon from "./ButtonWithIcon";

type Props = {
  onDrop: onDropType;
};

const ImportButton = ({ onDrop }: Props) => {
  return (
    <Dropzone
      noDrag
      accept={supportedFiles}
      onDrop={onDrop}
      dropZoneClassName="hover:bg-transparent hover:text-unset"
    >
      {(_) => (
        <ButtonWithIcon>
          <i className="fa-solid fa-circle-plus"></i>
          <span>Import</span>
        </ButtonWithIcon>
      )}
    </Dropzone>
  );
};

export default ImportButton;

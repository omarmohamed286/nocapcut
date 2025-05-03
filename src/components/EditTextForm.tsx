import { Input } from "./ui/input";
import { AddedText } from "@/customTypes";

type Props = {
  addedText: AddedText;
  changeAddedText: (addedText: AddedText) => void;
};

const EditTextForm = ({ addedText, changeAddedText }: Props) => {
  return (
    <form
      className="space-y-2 mt-2"
      onClick={() => changeAddedText({ ...addedText, isSelected: true })}
      onMouseDown={() => changeAddedText({ ...addedText, isSelected: true })}
    >
      <Input
        type="text"
        defaultValue={addedText.text}
        onChange={(e) =>
          changeAddedText({ ...addedText, text: e.target.value })
        }
      ></Input>
      <Input
        type="number"
        defaultValue={30}
        min={16}
        onChange={(e) =>
          changeAddedText({
            ...addedText,
            fontSize: e.target.valueAsNumber,
          })
        }
      ></Input>
    </form>
  );
};

export default EditTextForm;

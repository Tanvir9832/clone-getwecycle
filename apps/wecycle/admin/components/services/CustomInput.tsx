import { Button, Input } from "@tanbel/react-ui";
import type { Error } from "@tanbel/homezz/types";
import { useState } from "react";
import { Radio, Switch } from "antd";
import { ICON } from "@tanbel/react-icons";

type Props = {
  index: number;
  input: {
    inputType: string;
    label: string;
    name: string;
    unite?: string;
    defaultValue?: number | string;
    options?: {
      label: string;
      value: string;
    }[];
  };
  error?: Error<{
    title: string;
    description: string;
    cover: Blob;
    category: string;
    priceInputs: string;
  }> | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  handleOptionChange: (
    inputIndex: number,
    options: { label: string; value: string }[]
  ) => void;
  handleRemoveInput: (inputIndex: number) => void;
};

export const CustomInput: React.FC<Props> = ({
  index,
  input,
  error,
  handleInputChange,
  handleOptionChange,
  handleRemoveInput,
}) => {
  const [options, setOptions] = useState(
    input.options || [
      {
        label: "",
        value: "",
      },
    ]
  );
  const [isSame, setIsSame] = useState(false);

  const handleSwitchChange = (checked: boolean) => {
    setIsSame(checked);
    if (checked) {
      setOptions((prev) => {
        const updatedOptions = prev.map((option) => ({
          label: option.label,
          value: option.label,
        }));
        return updatedOptions;
      });
    }
  };

  const handleOptChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [name]: value,
      };
      if (isSame) {
        updatedOptions[optionIndex].value = value;
      }
      return updatedOptions;
    });
  };

  const handleAddOption = () => {
    setOptions((prev) => {
      const prevOptions = [...prev, { label: "", value: "" }];
      return prevOptions;
    });
  };

  const handleRemoveOption = (optionIndex: number) => {
    setOptions((prev) => {
      const updatedOptions = prev.filter((_, index) => index !== optionIndex);
      return updatedOptions;
    });
  };

  const saveOptions = () => {
    const filteredOptions = options.filter(
      (option) => option.label && option.value
    );
    handleOptionChange(index, filteredOptions);
  };

  return (
    <div className="flex flex-col gap-5 p-5 border rounded-md">
      <div className="flex gap-2 items-center">
        <p className="font-bold">Input type: </p>
        <Radio.Group
          value={input.inputType || "text"}
          onChange={(e) => handleInputChange(e as any, index)}
          name="inputType"
        >
          <Radio value="text">Text</Radio>
          <Radio value="select">Select</Radio>
        </Radio.Group>
      </div>

      <Input
        label="Input Label"
        error={error?.[`priceInputs[${index}].label`]}
        name={"label"}
        value={input.label}
        onChange={(e) => handleInputChange(e, index)}
      />
      {input.inputType === "select" ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-between">
            <h4 className="font-bold">Options: </h4>
            <Button size="small" onClick={handleAddOption}>
              Add New Option
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <p>Option labels and values are the same</p>
            <Switch size="small" onChange={handleSwitchChange} />
          </div>
          {options.map((option, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                error={error?.[`priceInputs[${index}].options[${i}].label`]}
                name={"label"}
                value={option.label}
                placeholder="Option label"
                onChange={(e) => handleOptChange(e, i)}
              />
              <Input
                error={error?.[`priceInputs[${index}].options[${i}].value`]}
                name={"value"}
                value={option.value}
                disabled={isSame}
                placeholder="Option value"
                onChange={(e) => handleOptChange(e, i)}
              />
              <Button size="small" danger onClick={() => handleRemoveOption(i)}>
                <ICON.DELETE />
              </Button>
            </div>
          ))}
          <div className="w-full p-2 bg-amber-100 rounded-md">
            <p className="text-amber-600 flex justify-center items-center gap-1">
              <ICON.WARNING />
              You must save the options to apply the changes
            </p>
          </div>
          <Button
            type="default"
            size="small"
            className="mt-2 border-primary text-primary hover:!bg-primary hover:!text-white group"
            onClick={saveOptions}
          >
            <span>
              <ICON.CHECK
                className="animate-ping hidden group-focus:inline"
                style={{ animationIterationCount: 1 }}
              />
            </span>
            Save Options
          </Button>
        </div>
      ) : (
        <>
          <Input
            label="Unit"
            error={error?.[`priceInrputs[${index}].unite`]}
            name={"unite"}
            value={input.unite}
            onChange={(e) => handleInputChange(e, index)}
          />
          <Input
            label="Price per unit"
            type="number"
            error={error?.[`priceInputs[${index}].defaultValue`]}
            name={"defaultValue"}
            value={input.defaultValue}
            onChange={(e) => handleInputChange(e, index)}
          />
        </>
      )}
      <div>
        <Button size="small" danger onClick={() => handleRemoveInput(index)}>
          Remove Input
        </Button>
      </div>
    </div>
  );
};

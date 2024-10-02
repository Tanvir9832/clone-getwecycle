import React from "react";
import { Dropdown as ANTDropdown, MenuProps } from "antd";
import { Button } from "./Button";

interface Props extends React.ComponentProps<typeof ANTDropdown> {
  items: {
    label: string | null;
    onClick: () => void;
  }[];
  children: React.ReactNode;
  customChildren?: boolean;
}

export const Dropdown = ({
  items,
  children,
  customChildren = false,
  ...props
}: Props) => {
  const menu = items.map((item, i) => ({
    key: i.toString(),
    label: <p onClick={item.onClick}>{item.label}</p>,
  }));

  return (
    <ANTDropdown
      menu={{ items: menu }}
      placement="bottomRight"
      arrow
      {...props}
    >
      {customChildren ? children : <Button size="small">{children}</Button>}
    </ANTDropdown>
  );
};

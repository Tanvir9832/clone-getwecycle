import { theme } from "@tanbel/homezz/utils";
import { Input as AInput, InputProps, InputRef } from "antd";
import { Space } from "./Space";
import { forwardRef } from "react";

interface Props extends Partial<InputProps> {
  label?: string;
  error?: string;
  password?: boolean;
}

export const Input = forwardRef<InputRef, Props>(
  ({ error, label, password = false, ...props }, ref) => {
    return (
      <div>
        <p className="mb-1 text-slate-500">{label}</p>
        <Space height={5} />
        {password ? (
          <AInput.Password size="large" {...props} />
        ) : (
          <AInput ref={ref} size="large" {...props} />
        )}
        <Space height={5} />
        {error && <p style={{ color: theme.danger, fontSize: 13 }}>{error}</p>}
      </div>
    );
  }
);

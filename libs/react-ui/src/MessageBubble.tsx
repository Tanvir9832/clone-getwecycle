import { theme } from "@tanbel/homezz/utils";
import { formatDate } from "@tanbel/utils";
import { CSSProperties } from "react";
import { PreviewableImage } from "./PreviewableImage";

interface IProps {
  isMe: boolean;
  message: string;
  isNotification?: boolean;
  attachments?: string[];
  createdAt?: Date | string;
}

export const MessageBubble = ({
  isMe,
  message,
  isNotification,
  attachments,
  createdAt,
}: IProps) => {
  const genStyle = (): CSSProperties => {
    const style: CSSProperties = {};
    if (isNotification) {
      style.backgroundColor = theme.tertiary;
      style.color = theme.primary;
      style.borderRadius = 20;
      style.fontSize = 12;
      style.border = "0.5px solid " + theme.primary;
      style.padding = "5px 10px";
      style.alignSelf = "center";
      style.display = "flex";
    } else {
      style.padding = "15px 20px";
      style.borderRadius = 10;
      style.color = theme.white;
      style.maxWidth = 300;
      if (isMe) {
        style.alignSelf = "flex-end";
        style.borderEndEndRadius = 0;
        style.backgroundColor = theme.white;
        style.color = theme.black;
        style.border = "0.5px solid " + theme.black;
      } else {
        style.alignSelf = "flex-start";
        style.borderEndStartRadius = 0;
        style.borderBottomRightRadius = 10;
        style.backgroundColor = theme.primary;
      }
    }
    return style;
  };
  return (
    <>
      {createdAt ? (
        <p
          style={{
            ...genStyle(),
            backgroundColor: "transparent",
            border: "none",
            color: theme.grey200,
            fontSize: 10,
            padding: 0,
          }}
        >
          {formatDate(createdAt, "P")}
        </p>
      ) : null}
      <div style={genStyle()}>
        {!!attachments?.length && (
          <div className="flex flex-col gap-5 mb-5">
            {attachments?.map((attachment, i) => (
              <PreviewableImage
                key={i}
                className="rounded-lg"
                height={200}
                width={200}
                src={attachment}
              />
            ))}
          </div>
        )}
        <p>{message}</p>
      </div>
    </>
  );
};

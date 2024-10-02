import { Image, ImageProps } from "antd";

type Props = ImageProps;

export function PreviewableImage({ ...rest }: Props) {
  return <Image {...rest} />;
}

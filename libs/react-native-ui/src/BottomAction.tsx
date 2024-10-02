import { css } from "@tanbel/homezz/utils";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children?: React.ReactNode;
  bottomMargin?: keyof typeof css.padding;
}

export const BottomAction = ({ children, bottomMargin }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: css.padding.md,
        marginBottom:
          insets.bottom + (bottomMargin ? css.padding[bottomMargin] : 0),
      }}
    >
      {children}
    </View>
  );
};

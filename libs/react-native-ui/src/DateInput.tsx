import React, { useState } from "react";
import {
  StyleSheet,
  TextInputProps,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { TEXT, Text } from "./Text";
import { css, theme } from "@tanbel/homezz/utils";
import DatePicker from "react-native-date-picker";
import { Clock } from "@tanbel/icons";
import { Icons } from "@tanbel/react-native-icons";

interface Props extends Partial<Omit<TextInputProps, "value" | "onChange">> {
  label?: string;
  error?: string;
  value: Date;
  mode?: "date" | "time" | "datetime";
  onChange: (date: Date) => void;
  small?: boolean;
}

export const DateInput = ({
  label,
  error,
  value,
  onChange,
  mode,
  small,
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <DatePicker
        mode={mode || "datetime"}
        modal
        open={open}
        date={value || new Date()}
        onConfirm={(date) => {
          onChange(date);
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      {label && (
        <Text size={15} subtitle style={styles.label}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          Keyboard.dismiss();
          setTimeout(() => {
            setOpen(true);
          }, 50);
        }}
      >
        <View
          style={[
            styles.input,
            small && {
              paddingHorizontal: css.padding.sm,
              paddingVertical: css.padding.sm,
            },
          ]}
        >
          <Text size={small ? 15 : 18} subtitle>
            {value ? value.toLocaleDateString() : "Select date"}
          </Text>
        </View>
        <View style={styles.rightIcon}>
          <Icons.Clock size={small ? 20 : undefined} color={theme.grey200} />
        </View>
        {error ? (
          <Text bold style={{ marginTop: 5 }}>
            {error}
          </Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  leftIcon: {
    position: "absolute",
    marginLeft: 15,
  },
  rightIcon: {
    position: "absolute",
    right: 15,
  },
  label: {
    marginBottom: 7,
  },
  container: {
    // flex: 1,
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
  },
  input: {
    // flex: 1,
    borderColor: theme.grey200,
    backgroundColor: theme.white,
    // elevation: 7,
    paddingHorizontal: css.padding.md,
    paddingVertical: css.padding.md,
    borderWidth: 1,
    fontSize: 18,
    borderRadius: css.border.radius.sm,
    color: theme.black,
  },
});

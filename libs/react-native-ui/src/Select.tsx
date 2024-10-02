import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TEXT, Text } from './Text';
import { ActionModal } from './Modal';
import { css, theme } from '@tanbel/homezz/utils';

interface Props {
  options: {
    label: string;
    value: string;
  }[];
  onSelect: (value: any) => void;
  value: string;
  defaultValue?: string;
  label: string;
}

export const Select = ({
  options,
  onSelect,
  value,
  defaultValue,
  label,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const labelFromValue = options.find((item) => item.value === value);
  const isActive = (v: string) => value === v;
  const handleSelect = (v: string) => {
    onSelect(v);
    setOpen(false);
  };
  return (
    <>
      <ActionModal isModalVisible={open} setIsModalVisible={setOpen}>
        <View style={styles.modal}>
          {options.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelect(item.value)}
              style={[
                styles.option,
                isActive(item.value) && { backgroundColor: theme.secondary },
              ]}
            >
              <Text primary={isActive(item.value)} bold={isActive(item.value)}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionModal>
      {label && (
        <Text size={15} subtitle style={styles.label}>
          {label}
        </Text>
      )}
      <TouchableOpacity style={styles.container} onPress={() => setOpen(true)}>
        <View style={[styles.input]}>
          <Text size={TEXT.SIZE.INPUT} subtitle>
            {labelFromValue?.label || defaultValue}
          </Text>
        </View>
        <View style={styles.rightIcon}></View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  option: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    // borderRadius: css.border.radius.sm,
  },
  modal: {
    backgroundColor: 'white',
    // padding: css.padding.md,
    borderRadius: css.border.radius.sm,
    overflow: 'hidden',
  },
  leftIcon: {
    position: 'absolute',
    marginLeft: 15,
  },
  rightIcon: {
    position: 'absolute',
    right: 15,
  },
  label: {
    marginBottom: 7,
  },
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    borderColor: theme.grey200,
    backgroundColor: theme.white,
    // elevation: 7,
    paddingLeft: css.padding.md,
    paddingVertical: css.padding.md,
    borderWidth: 1,
    fontSize: 18,
    borderRadius: css.border.radius.sm,
    color: theme.black,
  },
});

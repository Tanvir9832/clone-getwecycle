import { IIcon, Icons } from '@tanbel/react-native-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface IconWrapperProps extends IIcon {
  variant?: 'success' | 'danger' | 'default';
  icon: (typeof Icons)['Calendar'];
}

const color = {
  success: {
    backgroundColor: '#C4EFD5',
    color: '#00CD52',
  },
  danger: {
    backgroundColor: '#FFC8C8',
    color: '#FF5050',
  },
  default: {
    backgroundColor: 'lightblue',
    color: 'black',
  },
};

export const IconWrapper: React.FC<IconWrapperProps> = ({
  variant = 'default',
  icon,
  onPress,
  size,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.iconStyle,
        {
          borderColor: color[variant].color,
          borderWidth: 1,
          backgroundColor: color[variant].backgroundColor,
          borderRadius: 5,
        },
      ]}
    >
      {icon({
        color: color[variant].color,
        size,
      })}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    // width: 40,
    // height: 40,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

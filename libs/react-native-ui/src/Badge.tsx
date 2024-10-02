import { View } from 'react-native';
import React from 'react';
import { theme } from '@tanbel/homezz/utils';
import { Text } from './Text';

type Props = {
  children: React.ReactNode;
  type?: 'dot' | 'none' | 'text' | 'custom';
  content?: string | number;
  component?: React.ReactNode;
};

export const Badge = ({
  children,
  type = 'none',
  content,
  component,
}: Props) => {
  return (
    <View>
      {type === 'none' ? null : type === 'dot' ? (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            backgroundColor: theme.danger,
            borderRadius: 10,
            width: 12,
            height: 12,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        />
      ) : (
        <View
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: theme.danger,
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          {type === 'custom' ? (
            component
          ) : (
            <Text color="white" size={13}>
              {content}
            </Text>
          )}
        </View>
      )}
      <View>{children}</View>
    </View>
  );
};

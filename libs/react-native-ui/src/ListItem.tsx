import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowRight, LocationMarker, User } from '@tanbel/icons';
import { theme } from '@tanbel/homezz/utils';
import { Space } from './Space';
import { Text } from './Text';

type Props = {
  title: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  rightIcon?: React.ReactNode;
};

export const ListItem = ({ icon, title, onPress, rightIcon }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.list}>
      <View style={styles.listInfo}>
        {/* <View style={styles.icon}>{icon}</View> */}
        {/* <Space width={15} /> */}
        <Text bold>
          {title}
        </Text>
      </View>
      <View>
        {rightIcon || <ArrowRight />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.grey200,
    borderRadius: 10,
  },
  icon: {
    borderRadius: 10,
    padding: 7,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});

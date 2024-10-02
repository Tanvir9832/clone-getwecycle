import AntIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/FontAwesome';

export type IIcon = {
  size?: number;
  color?: string;
  onPress?: () => void;
};

const size = 25;

export const Icons = {
  Calendar: (arg: IIcon) => (
    <AntIcon name="calendar" size={arg.size || size} color={arg.color} />
  ),
  Clock: (arg: IIcon) => (
    <AntIcon name="clockcircleo" size={arg.size || size} color={arg.color} />
  ),
  Plus: (arg: IIcon) => (
    <AntIcon name="plus" size={arg.size || size} color={arg.color} />
  ),
  Delete: (arg: IIcon) => (
    <AntIcon
      name="delete"
      size={arg.size || size}
      color={arg.color}
      onPress={arg.onPress}
    />
  ),
  Cross: (arg: IIcon) => (
    <AntIcon
      name="close"
      size={arg.size || size}
      color={arg.color}
      onPress={arg.onPress}
    />
  ),
  Edit: (arg: IIcon) => (
    <AntIcon
      name="edit"
      size={arg.size || size}
      color={arg.color}
      onPress={arg.onPress}
    />
  ),
  Download: (arg: IIcon) => (
    <AntIcon
      name="download"
      size={arg.size || size}
      color={arg.color}
      onPress={arg.onPress}
    />
  ),
  Tag: (arg: IIcon) => (
    <IonIcon
      name="pricetag-outline"
      size={arg.size || size}
      color={arg.color}
      onPress={arg.onPress}
    />
  ),
  Home: (arg: IIcon) => (
    <IonIcon
      name="home"
      size={arg.size || size}
      color={arg.color}
      onPress={arg.onPress}
    />
  ),
  Chat: (arg: IIcon) => (
    <IonIcon
      name="chatbubble-ellipses"
      size={arg.size || size}
      color={arg.color}
      onPress={arg.onPress}
    />
  ),
  List: (arg: IIcon) => (
    <FontIcon
      name="th-list"
      size={arg.size || size}
      color={arg.color}
      onPress={arg.onPress}
    />
  ),
  Settings: (arg: IIcon) => (
    <IonIcon
      name="settings"
      size={arg.size || size}
      color={arg.color}
      onPress={arg.onPress}
    />
  ),
};

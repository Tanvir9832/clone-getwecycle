import {
  AccountBookOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BookOutlined,
  ContainerOutlined,
  DeleteTwoTone,
  DeleteOutlined,
  DesktopOutlined,
  EditTwoTone,
  ExclamationCircleFilled,
  GlobalOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
  SendOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  MenuOutlined,
  HomeOutlined,
  SettingOutlined,
  ClearOutlined,
  FileOutlined,
  AuditOutlined,
  MoreOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  WarningOutlined,
  CheckOutlined,
} from "@ant-design/icons";
type Icon = {
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

const size = 18;
const color = "black";

export const ICON = {
  ARROW_RIGHT: () => (
    <ArrowRightOutlined
      style={{ fontSize: size, color: color }}
      rev={undefined}
    />
  ),
  ARROW_LEFT: () => (
    <ArrowLeftOutlined
      style={{ fontSize: size, color: color }}
      rev={undefined}
    />
  ),
  PIE_CHART: () => (
    <PieChartOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  DESKTOP: () => (
    <DesktopOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  ORDER_LIST: () => (
    <OrderedListOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  BOOK: () => (
    <BookOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  USER_GROUP: () => (
    <UsergroupAddOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  USER: () => (
    <UserOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  ACCOUNT_BOOK: () => (
    <AccountBookOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  CONTAINER: () => (
    <ContainerOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  MESSAGE: () => (
    <MessageOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  MENU_FOLD: () => (
    <MenuFoldOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  MENU_UNFOLD: () => (
    <MenuUnfoldOutlined
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  MENU: ({ className }: { className?: string }) => (
    <MenuOutlined rev={undefined} className={className || ""} />
  ),
  LOGOUT: () => (
    <LogoutOutlined
      style={{
        fontSize: "20px",
      }}
      rev={undefined}
    />
  ),
  EXCLAMATION_CIRCLE: () => (
    <ExclamationCircleFilled
      rev={undefined}
      style={{ fontSize: size, color: color }}
    />
  ),
  SEND: ({ onClick }: Icon) => (
    <SendOutlined
      className="text-2xl text-primary"
      onClick={onClick}
      rev={undefined}
    />
  ),
  EDIT_TWO: ({ onClick }: Icon) => (
    <EditTwoTone
      className="text-primary"
      onClick={onClick}
      rev={undefined}
      style={{ fontSize: "20px" }}
    />
  ),
  DELETE_TWO: ({ onClick }: Icon) => (
    <DeleteTwoTone
      onClick={onClick}
      rev={undefined}
      color="red"
      className="text-red-500"
      style={{ fontSize: "20px", color: "red" }}
    />
  ),
  DELETE: ({ onClick, className }: Icon) => (
    <DeleteOutlined
      onClick={onClick}
      rev={undefined}
      className={className || ""}
    />
  ),
  WARNING: ({ onClick, className, style }: Icon) => (
    <WarningOutlined
      onClick={onClick}
      rev={undefined}
      style={style}
      className={className || ""}
    />
  ),
  CHECK: ({ onClick, className, style }: Icon) => (
    <CheckOutlined
      onClick={onClick}
      rev={undefined}
      style={style}
      className={className || ""}
    />
  ),
  PLUS: ({ onClick }: Icon) => (
    <PlusCircleOutlined
      onClick={onClick}
      rev={undefined}
      style={{ fontSize: "20px", color: "green" }}
    />
  ),
  LOG: () => (
    <GlobalOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  HOME: () => (
    <HomeOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  SETTING: () => (
    <SettingOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  CLEAR: () => (
    <ClearOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  FILES: () => (
    <FileOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  AUDIT: () => (
    <AuditOutlined rev={undefined} style={{ fontSize: size, color: color }} />
  ),
  MORE: ({ className }: { className?: string }) => (
    <MoreOutlined rev={undefined} className={className || ""} />
  ),
  PHONE: ({ className }: { className?: string }) => (
    <PhoneOutlined
      rev={undefined}
      style={{ fontSize: size }}
      className={className || ""}
    />
  ),
  MAIL: ({ className }: { className?: string }) => (
    <MailOutlined
      rev={undefined}
      style={{ fontSize: size }}
      className={className || ""}
    />
  ),
  ADDRESS: ({ className }: { className?: string }) => (
    <EnvironmentOutlined
      style={{ fontSize: size }}
      className={className || ""}
    />
  ),
};

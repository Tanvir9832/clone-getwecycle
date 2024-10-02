import { ICON } from "@tanbel/react-icons";
import { Layout, Menu, MenuProps, Modal, Space } from "@tanbel/react-ui";
import { Drawer } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { useAction } from "../hook/useAction";
import { useAppState } from "../store/appState";

const ONLY_PUBLIC_PATHS = ["/login", "/register", "/otp", "/contact"];

const { confirm } = Modal;

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?: () => void
): MenuItem {
  return {
    key,
    icon,
    label,
    onClick,
  } as MenuItem;
}

const navigation = [
  {
    key: "1",
    label: "Home",
    icon: <ICON.HOME />,
    path: "/",
  },
  {
    key: "2",
    label: "Messages",
    icon: <ICON.MESSAGE />,
    path: "/messages",
  },
  {
    key: "3",
    label: "Booking Status",
    icon: <ICON.AUDIT />,
    path: "/booking-status",
  },
  {
    key: "4",
    label: "Services",
    icon: <ICON.CLEAR />,
    path: "/services",
  },
  {
    key: "5",
    label: "Blogs",
    icon: <ICON.FILES />,
    path: "/blog",
  },
  {
    key: "6",
    label: "Settings",
    icon: <ICON.SETTING />,
    path: "/settings",
  },
  {
    key: "7",
    label: "Logout",
    icon: <ICON.LOGOUT />,
    path: "/",
  },
];

const PrivateLayout = ({
  children,
  className,
  parentClassName,
}: {
  children: React.ReactNode;
  className?: string;
  parentClassName?: string;
}) => {
  const router = useRouter();
  const { setSidebar, sidebar } = useAppState();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { logout } = useAction();

  if (ONLY_PUBLIC_PATHS.includes(router.pathname)) {
    router.push("/");
  }

  const getActiveKey = () => {
    const path = router.pathname;
    const nav = navigation.find((item) => item.path === path);
    return nav?.key || "1";
  };

  const askLogout = () => {
    confirm({
      title: "Do you want to logout?",
      icon: <ICON.EXCLAMATION_CIRCLE />,
      content: "You will be logged out of the system.",
      onOk() {
        logout();
      },
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div className="h-[60px] bg-white flex items-center justify-between shadow-sm px-6">
        <div className="flex items-center">
          <Space width={10} />
          <Image alt="logo" className="w-[90%]" src={Logo} />
        </div>
        <div className="cursor-pointer hidden lg:block p-2 rounded-full border">
          <ICON.USER />
        </div>
        <button
          onClick={() => setOpenDrawer(true)}
          className="block lg:hidden border rounded-md py-1 px-2 bg-transparent"
        >
          <ICON.MENU className="text-base" />
        </button>
      </div>
      <Layout style={{ minHeight: "100%" }} className="mt-1">
        <Sider
          collapsible
          theme="light"
          collapsedWidth={60}
          className="hidden lg:block"
          collapsed={sidebar}
          onCollapse={() => {
            setSidebar(!sidebar);
          }}
        >
          <div className="demo-logo-vertical"></div>
          <Menu
            selectedKeys={[getActiveKey()]}
            mode="inline"
            items={navigation.map((nav) => ({
              ...nav,
              onClick: () =>
                !nav.label.includes("Logout")
                  ? router.push(nav.path)
                  : askLogout(),
            }))}
          />
        </Sider>
        <Drawer
          placement="right"
          className="block lg:hidden"
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
        >
          <Menu
            selectedKeys={[getActiveKey()]}
            mode="inline"
            className="!border-none"
            items={navigation.map((nav) => ({
              ...nav,
              onClick: () => {
                setOpenDrawer(false);
                !nav.label.includes("Logout")
                  ? router.push(nav.path)
                  : askLogout();
              },
            }))}
          />
        </Drawer>
        <div className="w-full mx-auto">
          <div className="h-[calc(100vh-68px)] mb-0 lg:mx-1 lg:py-1 lg:px-2 bg-white overflow-auto">
            {children}
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default PrivateLayout;

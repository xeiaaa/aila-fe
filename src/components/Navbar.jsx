import {
  Drawer,
  Dropdown,
  Layout,
  Menu,
  Space,
  Flex,
  Divider,
  Avatar,
} from "antd";
import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import SettingsModal from "./SettingsModal";

import logo from "../assets/logo.svg";
import useNoteContext from "../context/useNoteContext";
import {
  FolderOutlined,
  UnorderedListOutlined,
  UserOutlined,
  LogoutOutlined,
  HighlightOutlined,
  SettingOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { SlDiamond } from "react-icons/sl";
import aila from "../assets/aila.svg";
import { MdOutlinePrivacyTip } from "react-icons/md";

import authAxios from "../api/authAxios";
import { TOKEN_KEY } from "../constants";
import { API_URL } from "../config";
import ProfilePage from "./Profile";
import DarkModeToggle from "./DarkModeToggle";
import { useWindowSize } from "../hooks/useWindowSize";
import { useQuery } from "@tanstack/react-query";

const { Header } = Layout;

const Navbar = () => {
  const { notes } = useNoteContext();
  const hasNotes = Array.isArray(notes) && notes.length > 0;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [isSettingsContentDrawerOpen, setIsSettingsContentDrawerOpen] =
    useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const { width: screenWidth } = useWindowSize();
  const isMobile = screenWidth < 640;

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await authAxios.get(`${API_URL}/auth/me`);
      return data;
    },
    staleTime: Infinity,
  });

  const getFirstAndSecondName = (fullName) => {
    if (!fullName) return "Loading...";
    const names = fullName.split(" ");
    return names.slice(0, 2).join(" ");
  };

  const handleSettingsClick = (e) => {
    setSelectedKey(e.key);
    if (isMobile) {
      setIsSettingsContentDrawerOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // const handleMenuClick = (e) => {
  //   setSelectedKey(e.key);
  // };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const renderSettingsContent = () => {
    switch (selectedKey) {
      case "1":
        return <ProfilePage />;
      case "2":
        return <DarkModeToggle />;
      default:
        return null;
    }
  };

  const tokensString = localStorage.getItem(TOKEN_KEY);

  const logoutMutation = useMutation({
    mutationFn: () => {
      if (tokensString) {
        const tokens = JSON.parse(tokensString);
        const refreshToken = tokens.refresh.token;

        localStorage.removeItem(TOKEN_KEY);
        return authAxios.post(`${API_URL}/auth/logout`, { refreshToken });
      }
    },
    onSuccess: () => {
      localStorage.removeItem(TOKEN_KEY);
    },
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error({ ERROR: error });
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : <UserOutlined />;
  };

  const items = [
    {
      key: "1",
      label: (
        <Flex vertical>
          <p className="text-gray-400 text-xs mb-1">Signed in as</p>
          <Flex className="gap-2 items-center">
            <Avatar size={30} className="dark:bg-textDark">
              {getInitial(profile?.name)}
            </Avatar>
            <Flex vertical>
              <span className="font-medium -mb-1">
                {profile?.name || "Loading..."}
              </span>
              <span className="text-gray-400">
                {profile?.email || "Loading..."}
              </span>
            </Flex>
          </Flex>
          <Divider className="mt-2 mb-0" />
        </Flex>
      ),
      className:
        "dark:!bg-secondaryDark dark:!text-textDark dark:!rounded-none dark:hover:!bg-tertiaryDark",
    },
    {
      key: "2",
      label: <span>Settings</span>,
      onClick: handleSettingsClick,
      className:
        "dark:!bg-secondaryDark dark:!text-textDark dark:!rounded-none dark:hover:!bg-tertiaryDark",
    },
    {
      key: "3",
      label: <span>Legal Center</span>,
      onClick: () => navigate("/policies"),
      className:
        "dark:!bg-secondaryDark dark:!text-textDark dark:!rounded-none dark:hover:!bg-tertiaryDark",
    },
    {
      key: "4",
      label: <span>Logout</span>,
      onClick: handleLogout,
      className:
        "dark:!bg-secondaryDark dark:!text-textDark dark:!rounded-none dark:hover:!bg-tertiaryDark",
    },
  ];

  const location = useLocation();
  const isNotePage =
    location.pathname === "/" || location.pathname === "/notes";

  if (!tokensString) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (isNotePage) {
    return (
      <>
        <div className="hidden sm:block drop-shadow-sm">
          <Header className="flex items-center justify-between bg-tertiary px-5 shadow dark:bg-secondaryDark">
            <div className="logo mr-5">
              <Link to="/notes" className="flex items-center justify-center">
                <img src={logo} />
              </Link>
            </div>
            <Menu
              mode="horizontal"
              className="flex-1 text-right justify-end bg-transparent dark:!bg-secondaryDark"
            >
              <Menu.Item key="1">
                <Link
                  to="/projects"
                  className="flex items-center"
                  style={{ color: "white" }}
                >
                  <FolderOutlined
                    className="text-primary mr-2"
                    style={{ fontSize: "16px" }}
                  />
                  Projects
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link
                  to="/pricing"
                  className="flex items-center"
                  style={{ color: "white" }}
                >
                  <SlDiamond
                    className="text-primary mr-2"
                    style={{ fontSize: "12px" }}
                  />
                  Pricing
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Dropdown menu={{ items }} placement="bottomRight">
                  <Space className="text-white">
                    {getFirstAndSecondName(profile?.name) || "Loading..."}
                    <DownOutlined />
                  </Space>
                </Dropdown>
              </Menu.Item>
            </Menu>
          </Header>
        </div>

        <div className="block sm:hidden">
          <Header
            className={`flex items-center px-8 ${
              hasNotes ? "justify-end" : "justify-center"
            } bg-tertiary dark:bg-secondaryDark`}
          >
            {hasNotes ? (
              <div className="w-[53vw] flex justify-between items-center">
                <img src={aila} className="w-20 text-center" />
                <UnorderedListOutlined
                  className="text-xl cursor-pointer text-white"
                  onClick={() => {
                    setIsDrawerOpen(true);
                  }}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <img src={aila} className="w-20 text-center" />
                <UnorderedListOutlined
                  className="absolute right-7 text-xl cursor-pointer text-white"
                  onClick={() => {
                    setIsDrawerOpen(true);
                  }}
                />
              </div>
            )}
          </Header>
        </div>

        <Drawer
          placement="bottom"
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
          className="rounded-t-2xl dark:bg-secondaryDark dark:text-textDark"
        >
          <Menu
            mode="vertical"
            className="flex flex-col text-lg dark:bg-secondaryDark dark:text-textDark px-6"
          >
            <Menu.Item
              key="1"
              style={{
                display: "flex",
              }}
              className="dark:text-textDark"
            >
              <Link to="/projects">
                <FolderOutlined
                  className="text-primary mr-2"
                  style={{ fontSize: "24px" }}
                />
                Projects
              </Link>
            </Menu.Item>
            <Menu.Item
              key="2"
              style={{
                display: "flex",
              }}
              className="dark:text-textDark"
            >
              <Link to="/pricing">
                <SlDiamond
                  className="text-primary mr-2"
                  style={{ fontSize: "20px" }}
                />
              </Link>
              Pricing
            </Menu.Item>
            <Menu.Item
              key="3"
              style={{
                display: "flex",
              }}
              onClick={() => {
                setIsSettingsDrawerOpen(true);
                setIsDrawerOpen(false);
              }}
              className="dark:text-textDark"
            >
              <SettingOutlined
                className="text-primary mr-2"
                style={{ fontSize: "24px" }}
              />
              Settings
            </Menu.Item>
            <Menu.Item
              key="5"
              onClick={() => navigate("/policies")}
              className="dark:text-textDark"
            >
              <MdOutlinePrivacyTip
                className="text-primary mr-2"
                style={{ fontSize: "24px" }}
              />
              Legal Center
            </Menu.Item>

            <Menu.Item
              key="6"
              style={{}}
              onClick={handleLogout}
              className="dark:text-textDark"
            >
              <LogoutOutlined
                className="text-primary mr-2"
                style={{ fontSize: "24px" }}
              />
              Logout
            </Menu.Item>
          </Menu>
        </Drawer>

        {/* Settings modal */}
        <SettingsModal
          visible={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
        {/* Settings Drawer */}
        <Drawer
          placement="bottom"
          closable={true}
          open={isSettingsDrawerOpen}
          onClose={() => {
            setIsSettingsDrawerOpen(false);
            setIsDrawerOpen(true);
          }}
          className="rounded-t-2xl dark:bg-secondaryDark dark:text-textDark"
        >
          <Menu
            mode="vertical"
            className="flex flex-col text-lg dark:bg-secondaryDark px-6"
          >
            <Menu.Item
              key="1"
              style={{ fontSize: "18px" }}
              onClick={handleSettingsClick}
              className="dark:text-textDark dark:active:text-text "
            >
              <UserOutlined
                className="text-primary mr-2"
                style={{ fontSize: "24px" }}
              />
              Profile
            </Menu.Item>
            <Menu.Item
              key="2"
              style={{ fontSize: "18px" }}
              onClick={handleSettingsClick}
              className="dark:text-textDark dark:active:text-text "
            >
              <HighlightOutlined
                className="text-primary mr-2"
                style={{ fontSize: "24px" }}
              />
              Appearance
            </Menu.Item>
          </Menu>
        </Drawer>

        {/* Settings Content Drawer */}
        <Drawer
          placement="bottom"
          closable={true}
          open={isSettingsContentDrawerOpen}
          onClose={() => setIsSettingsContentDrawerOpen(false)}
          height="42%"
          className="dark:bg-secondaryDark dark:text-textDark"
        >
          {renderSettingsContent()}
        </Drawer>
      </>
    );
  }
};

export default Navbar;

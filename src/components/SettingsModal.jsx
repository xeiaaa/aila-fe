import { Menu, Button } from "antd";
import { UserOutlined, InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import ProfilePage from "./Profile";
import DarkModeToggle from "./DarkModeToggle";
import { CloseOutlined } from "@ant-design/icons";

const SettingsModal = ({ visible, handleOk }) => {
  const [selectedKey, setSelectedKey] = useState("1");

  const settingsItems = [
    {
      key: "1",
      label: <span>Profile</span>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: <span>Appearance</span>,
      icon: <InboxOutlined />,
    },
  ];

  const handleOkModal = () => {
    handleOk();
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <ProfilePage />;
      case "2":
        return <DarkModeToggle />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* <StyledModal
        title="Settings"
        visible={visible}
        onOk={handleOkModal}
        onCancel={handleCancelModal}
        footer={null}
        width={600}
        isDarkMode={isDarkMode}
      >
        <div className="flex">
          <Menu
            style={{ width: 160 }}
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={settingsItems}
            onClick={({ key }) => setSelectedKey(key)}
          />
          <div className="w-full justify-center items-center p-5">
            {renderContent()}
          </div>
        </div>
      </StyledModal> */}

      {/* Modal toggle  */}
      {/* <button
        data-modal-target="default-modal"
        data-modal-toggle="default-modal"
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Toggle modal
      </button> */}

      {/* Main modal  */}
      <div
        id={visible ? "visible" : "hidden"}
        tabIndex="-1"
        aria-hidden={!visible}
        className={`${
          visible ? "" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-2/4 left-2/4 z-50 justify-center items-center w-full md:inset-0 h-full backdrop-brightness-50`}
      >
        <div className="absolute top-1/4 left-0 bottom-0 right-0 m-auto p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-tertiaryDark dark:text-textDark">
            <div className="flex items-center justify-between p-4 md:py-3 md:px-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold dark:text-white">
                Settings
              </h3>
              <Button
                className="bg-transparent text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:!bg-gray-600 dark:hover:text-white border-none"
                onClick={handleOkModal}
              >
                <CloseOutlined className="dark:text-textDark" />
                <span className="sr-only">Close modal</span>
              </Button>
            </div>
            <div className="flex px-7 pb-7">
              <Menu
                style={{ width: 160 }}
                defaultSelectedKeys={["1"]}
                mode="inline"
                items={settingsItems}
                onClick={({ key }) => setSelectedKey(key)}
                className="dark:bg-tertiaryDark dark:!text-textDark"
              />
              <div className="w-full justify-center items-center">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;

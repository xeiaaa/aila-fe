import { Drawer } from "antd";
import { useWindowSize } from "../hooks/useWindowSize";

const Sidebar = ({
  showTab,
  children,
  width,
  toggleTab,
  position = "left",
}) => {
  const { width: screenWidth } = useWindowSize();

  if (screenWidth < 640) {
    return (
      <Drawer
        className="block sm:hidden"
        placement={position}
        closable={false}
        onClose={toggleTab}
        open={showTab}
        width={position === "bottom" ? "100%" : width}
        height={position === "bottom" ? "100%" : "unset"}
        closeIcon={null}
        style={{ padding: 0, margin: 0 }}
      >
        {children}
      </Drawer>
    );
  } else {
    return (
      <div
        className={`hidden sm:block flex-shrink-0 overflow-x-hidden transition-all rounded-lg my-5 mx-2.5 bg-background dark:bg-secondaryDark ${
          showTab ? "border-2 border-solid border-secondary dark:border-borderDark" : " border-none"
        }`}
        style={{
          width: showTab ? width : "0px",
          visibility: showTab ? "visible" : "invisible",
        }}
      >
        <div className="h-full" style={{ width: width }}>
          <div className="flex h-full min-h-0 flex-col">
            <div
              className={`flex h-full min-h-0 flex-col transition-opacity ${
                showTab ? "opacity-100" : "opacity-50"
              }`}
            >
              <div className="relative h-full w-full flex-1 items-start">
                <nav className="flex h-full w-full flex-col">
                  <div className="flex-col flex-1 transition-opacity duration-500 overflow-y-auto">
                    {children}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Sidebar;

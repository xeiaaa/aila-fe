import { useState, useEffect } from "react";
import { Button, Flex } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

const DarkModeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Get theme preference from localStorage or default to "light"
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ?? "light";
  });

  useEffect(() => {
    // Apply theme class to document element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save theme preference to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleLightTheme = () => {
    setTheme("light");
  };

  const toggleDarkTheme = () => {
    setTheme("dark");
  };

  return (
    <Flex className="justify-center items-center flex-col md:flex-row gap-5 md:gap-3 h-full px-7 md:px-0 pt-3 md:pt-0 pb-7 md:pb-0">
      <Button
        className={` w-3/4 h-full md:w-40 md:h-24 bg-white hover:!bg-slate-100 hover:!text-text font-medium !border-solid !border-gray-300 md:border-none shadow ${
          theme === "light"
            ? "border-[#28a745] hover:!border-[#28a745]"
            : "border-none"
        }`}
        onClick={toggleLightTheme}
      >
        {theme === "light" ? (
          <CheckCircleFilled className="text-2xl text-[#28a745]" />
        ) : (
          "Light"
        )}
      </Button>
      <Button
        className={` w-3/4 h-full md:w-40 md:h-24 bg-tertiaryDark hover:!bg-secondaryDark text-white font-medium hover:!text-white shadow ${
          theme === "dark"
            ? "border-[#28a745] hover:!border-[#28a745]"
            : "border-none"
        }`}
        onClick={toggleDarkTheme}
      >
        {theme === "dark" ? (
          <CheckCircleFilled className="text-2xl text-[#28a745]" />
        ) : (
          "Dark"
        )}
      </Button>
    </Flex>
  );
};

export default DarkModeToggle;

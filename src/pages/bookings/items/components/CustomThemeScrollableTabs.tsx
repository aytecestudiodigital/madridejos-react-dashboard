import { CustomFlowbiteTheme } from "flowbite-react";

export const customThemeTab: CustomFlowbiteTheme["tab"] = {
  base: "flex flex-col",
  tablist: {
    base: "flex text-center py-1 px-1",
    styles: {
      fullWidth:
        "w-full text-sm font-medium grid grid-flow-col dark:text-gray-400 rounded-none",
    },
    tabitem: {
      base: "flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 focus:ring-4 focus:ring-cyan-300 focus:outline-none",
      styles: {
        fullWidth: {
          base: "rounded-t-lg border-b border-gray-200 dark:border-gray-700",
          active: {
            on: "bg-gray-100 text-cyan-600 dark:bg-gray-800 dark:text-cyan-500 ",
            off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 ",
          },
        },
      },
      icon: "mr-1 h-4 w-4",
    },
  },
  tabpanel: "",
};

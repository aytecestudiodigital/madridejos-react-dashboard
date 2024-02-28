import { Flowbite, useThemeMode } from "flowbite-react";
import { useEffect } from "react";
import { Outlet } from "react-router";
import theme from "../flowbite-theme";

export default function FlowbiteWrapper() {
  const dark = localStorage.getItem("theme") === "dark";

  return (
    <Flowbite theme={{ dark, theme }}>
      <PersistFlowbiteThemeToLocalStorage />
      <Outlet />
    </Flowbite>
  );
}

export function PersistFlowbiteThemeToLocalStorage() {
  const [themeMode] = useThemeMode();

  useEffect(() => {
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  return <></>;
}

import { MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";

import { useIdle, useLocalStorage, useHotkeys } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowHeight } from "../utils/useWindowHeight";
import { ColorPicker } from "./ColorPicker";
import { ColorWheelButton } from "./ColorWheelButton";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [localStorageColor, setLocalStorageColor] = useLocalStorage({
    key: "bg-color-value",
    defaultValue: "#000000",
  });
  const [color, setColor] = useState(localStorageColor);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const { windowHeight } = useWindowHeight();

  function handleColorChange(color: string) {
    setColor(color);
    setLocalStorageColor(color);
  }

  const idle = useIdle(2000);

  useEffect(() => {
    if (localStorageColor) {
      setColor(localStorageColor);
    }
  }, [localStorageColor]);

  useHotkeys([
    ["B", () => handleColorChange("#000000")],
    ["W", () => handleColorChange("#ffffff")],
    ["Y", () => handleColorChange("#ffc500")],
    ["Escape", () => setShowColorPicker(false)],
    ["Space", () => setShowColorPicker(!showColorPicker)],
  ]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <motion.div
        className="relative h-screen w-screen"
        style={{ background: color }}
        initial={{ height: "100vh" }}
        animate={{ height: windowHeight }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute bottom-4 left-4 text-white flex gap-4 items-center">
          <AnimatePresence mode="wait">
            {showColorPicker ? (
              <ColorPicker
                color={color}
                setColor={handleColorChange}
                setShow={setShowColorPicker}
                key="color-picker"
              />
            ) : !idle ? (
              <ColorWheelButton
                onClick={() => setShowColorPicker(true)}
                key="color-picker-button"
              />
            ) : (
              <></>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Analytics />
    </MantineProvider>
  );
}

export default App;

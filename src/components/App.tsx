import { MantineProvider, Kbd } from "@mantine/core";
import { useState } from "react";

import {
  HotkeyItem,
  useHotkeys,
  useIdle,
  useLocalStorage,
} from "@mantine/hooks";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowHeight } from "../utils/useWindowHeight";
import { ColorPicker } from "./ColorPicker";
import { ColorWheelButton } from "./ColorWheelButton";
import { Notifications, notifications } from "@mantine/notifications";
export interface SwatchType {
  color: string;
  keyboardShortcut: string;
}

function App() {
  //State
  const [localStorageColor, setLocalStorageColor] = useLocalStorage({
    key: "bg-color-value",
    defaultValue: "#000000",
  });
  const [swatches, setSwatches] = useLocalStorage<SwatchType[]>({
    key: "swatches",
    defaultValue: [
      { color: "#000000", keyboardShortcut: "1" },
      { color: "#ffffff", keyboardShortcut: "2" },
      { color: "", keyboardShortcut: "3" },
      { color: "", keyboardShortcut: "4" },
      { color: "", keyboardShortcut: "5" },
    ],
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hoveringColorWheel, setHoveringColorWheel] = useState(false);

  //Hooks
  const { windowHeight } = useWindowHeight();
  const idle = useIdle(2000);

  //Handlers
  function handleColorChange(color: string) {
    //Filter out any empty strings
    if (color) {
      setLocalStorageColor(color);
      setHoveringColorWheel(false);
    }
  }

  function handleAddColor(color: string, index: number) {
    // Check21 that the color isn't already saved
    const colorAlreadySaved = swatches.some((swatch) => swatch.color === color);
    if (colorAlreadySaved) {
      notifications.show({
        message: "👈 That color is already saved, ya goof",
        autoClose: 3000,
      });
      return;
    }
    setSwatches((prevSwatches) => {
      const newSwatches = [...prevSwatches];
      newSwatches[index].color = color;
      return newSwatches;
    });
  }

  function handleDeleteColor(index: number) {
    console.log("Deleting index", index);
    setSwatches((prevSwatches) => {
      const newSwatches = [...prevSwatches];
      newSwatches[index].color = "";
      return newSwatches;
    });
  }

  //Spread the swatches into an array of arrays, so we can use the keyboard shortcuts
  const swatchArray: HotkeyItem[] = swatches.map((swatch) => [
    swatch.keyboardShortcut,
    () => handleColorChange(swatch.color),
  ]);

  useHotkeys([
    ...swatchArray,
    ["Escape", () => setShowColorPicker(false)],
    ["Space", () => setShowColorPicker(!showColorPicker)],
  ]);

  return (
    <MantineProvider
      // theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications />
      <motion.div
        className="relative h-screen w-screen"
        style={{ background: localStorageColor }}
        initial={{ height: "100vh" }}
        animate={{ height: windowHeight }}
        transition={{ duration: 0.01 }}
      >
        <div className="absolute bottom-4 left-4 text-white flex gap-4 items-center">
          <AnimatePresence mode="wait">
            {showColorPicker ? (
              <ColorPicker
                color={localStorageColor}
                setColor={handleColorChange}
                setShow={setShowColorPicker}
                key="color-picker"
                swatches={swatches}
                handleAddColor={handleAddColor}
                handleDeleteColor={handleDeleteColor}
              />
            ) : // Show the color wheel button when user is not idle
            !idle ? (
              <motion.div
                onHoverStart={() => setHoveringColorWheel(true)}
                onHoverEnd={() => setHoveringColorWheel(false)}
                className="flex items-center gap-4"
              >
                <ColorWheelButton
                  onClick={() => setShowColorPicker(true)}
                  key="color-picker-button"
                />
                {hoveringColorWheel && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Kbd>space</Kbd>
                  </motion.div>
                )}
              </motion.div>
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

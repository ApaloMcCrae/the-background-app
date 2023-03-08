import { Kbd, MantineProvider, Popover, Tabs } from "@mantine/core";
import { useState } from "react";

import {
  HotkeyItem,
  useHotkeys,
  useIdle,
  useLocalStorage,
} from "@mantine/hooks";
import { Notifications, notifications } from "@mantine/notifications";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowHeight } from "../utils/useWindowHeight";
import { ColorPicker } from "./ColorPicker";
import { ColorWheelButton } from "./ColorWheelButton";
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
  const [showTipJar, setShowTipJar] = useState(false);
  const [numberOfColorsChanged, setNumberOfColorsChanged] = useState(0);

  //Hooks
  const { windowHeight } = useWindowHeight();
  const idle = useIdle(2000);
  const tipJarIdle = useIdle(5000);

  //Handlers
  function handleColorChange(color: string) {
    //Filter out any empty strings
    setNumberOfColorsChanged((prev) => prev + 1);
    if (color) {
      setLocalStorageColor(color);
      setHoveringColorWheel(false);
      if (numberOfColorsChanged > 3) {
        setShowTipJar(true);
      }
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

  //Add the swatches, escape, and spacebar to the hotkeys
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
      <motion.main
        className="relative overflow-hidden"
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
        {/* Donation popover */}
        {showTipJar && (
          <Popover
            position="top"
            withArrow
            shadow="md"
            radius={"lg"}
            onClose={() => setShowTipJar(false)}
          >
            {!tipJarIdle && (
              <Popover.Target>
                <motion.button
                  className="absolute bottom-6 right-10 text-4xl outline-none z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.3, rotate: [-5, 5, -15, 15, -5, 5] }}
                  whileTap={{ scale: 0.9 }}
                >
                  👋
                </motion.button>
              </Popover.Target>
            )}
            <Popover.Dropdown>
              <div className="w-full text-center mb-6 mt-2">
                <h2 className="font-extrabold font-rounded text-lg lg:text-2xl text-transparent bg-clip-text bg-gradient-to-tr from-blue-800 to-cyan-500">
                  Tip Jar
                </h2>
                <small className="font-semibold text-gray-700">
                  Let's keep this app free forever 🤙
                </small>
              </div>
              <Tabs
                variant="pills"
                defaultValue="paypal"
                style={{ width: "100%" }}
              >
                <Tabs.List position="center">
                  <Tabs.Tab value="paypal" className="font-bold">
                    PayPal
                  </Tabs.Tab>
                  <Tabs.Tab value="venmo" className="font-bold">
                    Venmo
                  </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="paypal" pt="xs">
                  <motion.img
                    src="/assets/paypal-qr.jpg"
                    className="w-[300px] h-[300px]"
                  />
                </Tabs.Panel>
                <Tabs.Panel value="venmo" pt="xs">
                  <motion.img
                    src="/assets/venmo-qr.jpg"
                    className="w-[300px] h-[300px]"
                    onHoverStart={() => setShowTipJar(true)}
                  />
                </Tabs.Panel>
              </Tabs>
            </Popover.Dropdown>
          </Popover>
        )}
        <motion.div
          className="absolute bottom-0 right-0 w-10 h-10 lg:w-40 lg:h-40 z-0"
          onHoverStart={() => setShowTipJar(true)}
        />
      </motion.main>
      <Analytics />
    </MantineProvider>
  );
}

export default App;

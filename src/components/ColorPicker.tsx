import { ColorPicker as MantineColorPicker, Kbd } from "@mantine/core";
import { motion } from "framer-motion";
import invert from "invert-color";
import { SwatchType } from "./App";
import { DynamicHeroIcon } from "./DynamicHeroIcon";
import "./ColorPicker.css";
import { useState } from "react";

export function ColorPicker({
  color,
  setColor,
  setShow,
  swatches,
  handleAddColor,
  handleDeleteColor,
}: {
  color: string;
  setColor: (color: string) => void;
  setShow: (show: boolean) => void;
  swatches: SwatchType[];
  handleAddColor: (color: string, index: number) => void;
  handleDeleteColor: (index: number) => void;
}) {
  const [showDeleteOnSwatchIndex, setShowDeleteOnSwatchIndex] = useState(-1);
  const [hoveringEscape, setHoveringEscape] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      layout
    >
      <MantineColorPicker size="lg" value={color} onChange={setColor} />
      <div className="flex gap-x-3 mt-4">
        {/* Note: We have to use HEX colors, for this invert function to work */}
        {swatches.map(({ color: swatchColor, keyboardShortcut }, index) => (
          <motion.div key={index}>
            {swatchColor ? (
              <div className="relative">
                <motion.button
                  style={{
                    backgroundColor: swatchColor,
                    color: invert(swatchColor, true),
                  }}
                  className="p-2 font-extrabold text-2xl rounded-lg shadow-lg w-12 h-12 flex items-center justify-center border-2 border-black/10"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setColor(swatchColor)}
                  onHoverStart={() => setShowDeleteOnSwatchIndex(index)}
                  onHoverEnd={() => setShowDeleteOnSwatchIndex(-1)}
                >
                  <span className="font-rounded letter-stroke">
                    {keyboardShortcut}
                  </span>
                </motion.button>
                {index > 1 && index === showDeleteOnSwatchIndex && (
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="-top-3 -right-2 absolute w-6 h-6 rounded-full"
                    onClick={() => handleDeleteColor(index)}
                    style={{
                      color: invert(color, true),
                      backgroundColor: color,
                    }}
                    onHoverStart={() => setShowDeleteOnSwatchIndex(index)}
                    onHoverEnd={() => setShowDeleteOnSwatchIndex(-1)}
                  >
                    <DynamicHeroIcon
                      icon="XCircleIcon"
                      className="drop-shadow-sm rounded-full saturate-0 contrast-200"
                    />
                  </motion.button>
                )}
                {/* Little bar to indicate the current color */}
                <div className="h-2 w-full">
                  {swatchColor === color && (
                    <motion.div
                      className="w-2/4 h-2 rounded-full mt-2 mx-auto saturate-0 contrast-200"
                      style={{ backgroundColor: invert(color, true) }}
                      layoutId="color-picker-indicator"
                    />
                  )}
                </div>
              </div>
            ) : (
              <motion.button
                className="p-2 font-bold text-2xl rounded-lg shadow-lg w-12 h-12 flex items-center justify-center border-2 border-black/10"
                style={{
                  color: invert(color, true),
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAddColor(color, index)}
              >
                <DynamicHeroIcon
                  icon="PlusIcon"
                  className="drop-shadow-sm rounded-full saturate-0 contrast-200"
                />
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="-top-8 -right-8 absolute flex gap-y-2 flex-col w-8">
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.2 }}
          className=" w-8 h-8 rounded-full"
          onClick={() => setShow(false)}
          style={{ color: invert(color, true), backgroundColor: color }}
          onHoverStart={() => setHoveringEscape(true)}
          onHoverEnd={() => setHoveringEscape(false)}
        >
          <DynamicHeroIcon
            icon="XCircleIcon"
            className="drop-shadow-sm rounded-full saturate-0 contrast-200"
          />
        </motion.button>
        {hoveringEscape && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Kbd>esc</Kbd>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { MantineProvider } from '@mantine/core';

import { AnimatePresence, motion } from 'framer-motion';
import { ColorPicker } from './ColorPicker';
import { useIdle } from '@mantine/hooks';

function App() {
  const [color, setColor] = useState('rgba(47, 119, 150, 0.7)');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const idle = useIdle(2000);
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div className="relative h-screen w-screen" style={{ background: color }}>
        <div className="absolute bottom-4 left-4 text-white flex gap-4 items-center">
          <AnimatePresence mode="wait">
            {showColorPicker ? (
              <ColorPicker
                color={color}
                setColor={setColor}
                setShow={setShowColorPicker}
              />
            ) : !idle ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowColorPicker(true)}
                className="w-8 h-8 rounded-full border-2 border-white translate"
                whileTap={{ scale: 0.9 }}
                whileHover={{
                  scale: 1.3,
                  rotate: 45,
                }}
                key="color-picker-button"
              >
                <img src="/assets/color-wheel.png" alt="color wheel" />
              </motion.button>
            ) : (
              <></>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;

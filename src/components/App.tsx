import { useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';

import { AnimatePresence, motion } from 'framer-motion';
import { ColorPicker } from './ColorPicker';
import { useIdle, useLocalStorage } from '@mantine/hooks';
import { useWindowHeight } from '../utils/useWindowHeight';
import { ColorWheelButton } from './ColorWheelButton';

function App() {
  const [localStorageColor, setLocalStorageColor] = useLocalStorage({
    key: 'bg-color-value',
    defaultValue: 'rgba(0, 0, 0, 0.9)',
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
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <motion.div
        className="relative h-screen w-screen"
        style={{ background: color }}
        initial={{ height: '100vh' }}
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
    </MantineProvider>
  );
}

export default App;

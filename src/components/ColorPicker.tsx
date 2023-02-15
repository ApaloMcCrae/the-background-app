import { ColorPicker as MantineColorPicker } from '@mantine/core';
import { motion } from 'framer-motion';
import { DynamicHeroIcon } from './DynamicHeroIcon';
import invert from 'invert-color';

export function ColorPicker({
  color,
  setColor,
  setShow,
}: {
  color: string;
  setColor: (color: string) => void;
  setShow: (show: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
    >
      <MantineColorPicker
        size="lg"
        value={color}
        onChange={setColor}
        swatches={['#000000', '#ffffff', '#fab005', '#fd7e14']}
      />
      <motion.button
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.2 }}
        className="-top-10 -right-10 absolute w-8 h-8"
        onClick={() => setShow(false)}
        style={{ color: invert(color), backgroundColor: color }}
      >
        <DynamicHeroIcon
          icon="XCircleIcon"
          className="drop-shadow-sm rounded-full"
        />
      </motion.button>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { DynamicHeroIcon } from './DynamicHeroIcon';
import { ColorPicker as MantineColorPicker } from '@mantine/core';

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
      key="color-picker"
    >
      <MantineColorPicker size="lg" value={color} onChange={setColor} />
      <motion.button
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.2 }}
        className="-top-10 -right-10 absolute w-8 h-8"
        onClick={() => setShow(false)}
      >
        <DynamicHeroIcon icon="XCircleIcon" className="text-gray-300" />
      </motion.button>
    </motion.div>
  );
}

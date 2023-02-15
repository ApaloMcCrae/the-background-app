import { motion } from 'framer-motion';

export function ColorWheelButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="w-12 h-12 rounded-full border-2 border-white translate"
      whileTap={{ scale: 0.9 }}
      whileHover={{
        scale: 1.3,
        rotate: 45,
      }}
    >
      <img src="/assets/color-wheel.png" alt="color wheel" />
    </motion.button>
  );
}

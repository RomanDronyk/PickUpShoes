import {motion} from 'framer-motion';

const spinTransition = {
  repeat: Infinity,
  duration: 1,
  ease: 'linear',
};

export default function Loader() {
  return (
    <div>
      <motion.span
        className="block w-5 h-5 border-[3px] border-black/10 rounded-full border-t-black"
        animate={{rotate: 360}}
        transition={spinTransition}
      />
    </div>
  );
}

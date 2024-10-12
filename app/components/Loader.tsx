import {motion} from 'framer-motion';

const spinTransition = {
  repeat: Infinity,
  duration: 1,
  ease: 'linear',
};

export default function Loader({isBlack=true}) {
  return (
    <div>
      <motion.span
        className={`block w-5 h-5 border-[3px] border-${isBlack? "black": "white"}/${isBlack? "10": "5"} rounded-full border-t-${isBlack? "black": "white"}`}
        animate={{rotate: 360}}
        transition={spinTransition}
      />
    </div>
  );
}

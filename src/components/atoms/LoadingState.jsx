import { motion } from 'framer-motion';

const LoadingState = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              y: [0, -8, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <span className="text-gray-600 font-medium">{text}</span>
    </div>
  );
};

export default LoadingState;
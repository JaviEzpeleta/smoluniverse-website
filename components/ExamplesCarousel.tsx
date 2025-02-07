import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";

const IMAGES = [
  "image2.png",
  "image1.png",
  "image3.png",
  "image4.png",
  "image5.png",
  "image6.png",
  "image7.png",
  "image8.png",
  "image9.png",
  "image10.png",
  "image11.png",
  "image12.png",
  "image13.png",
  "image14.png",
  "image15.png",
  "image16.png",
  "image17.png",
  "image18.png",
  "image19.png",
  "image20.png",
  "image21.png",
  "image22.png",
  "image23.png",
  "image24.png",
  "image25.png",
  "image26.png",
  "image27.png",
  "image28.png",
];

const ExamplesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const input = [-200, 0, 200];
  const opacity = useTransform(x, input, [0, 1, 0]);

  const slideLeft = () => {
    setCurrentIndex((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1));
  };

  const slideRight = () => {
    setCurrentIndex((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden relative pt-4 w-full max-w-4xl mx-auto">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          //   dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) {
              slideLeft();
            } else if (info.offset.x < -100) {
              slideRight();
            }
          }}
          style={{ x }}
          className="flex items-center"
        >
          <AnimatePresence mode="wait">
            <motion.img
              draggable={false}
              key={currentIndex}
              src={"/images/examples/" + IMAGES[currentIndex]}
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              //   transition={{ duration: 0.5 }}
              className="w-full h-[340px] object-contain"
              alt={`Slide ${currentIndex + 1}`}
              style={{ opacity }}
            />
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={slideLeft}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 p-2 rounded-full shadow-lg hover:bg-zinc-800 active:scale-75 transition-colors"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      <button
        onClick={slideRight}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 p-2 rounded-full shadow-lg hover:bg-zinc-800 active:scale-75 transition-colors"
      >
        <ArrowRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ExamplesCarousel;

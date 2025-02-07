import FullPageSlider from "@/components/FullPageSlider";
import HowItWorksSlide1 from "@/components/HowItWorksSlide1";
import HowItWorksSlide2 from "@/components/HowItWorksSlide2";

const HowItWorks = () => {
  const slides = [
    {
      id: 1,
      content: <HowItWorksSlide1 />,
    },
    {
      id: 2,
      content: <HowItWorksSlide2 />,
    },
    {
      id: 3,
      content: (
        <div className="h-full bg-blue-500 flex items-center justify-center text-3xl text-white">
          Slide 3
        </div>
      ),
    },
  ];
  return (
    <div className="">
      <FullPageSlider slides={slides} />
    </div>
  );
};

export default HowItWorks;

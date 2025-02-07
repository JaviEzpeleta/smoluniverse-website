import FullPageSlider from "@/components/FullPageSlider";

const HowItWorks = () => {
  const slides = [
    {
      id: 1,
      content: (
        <div className="h-screen bg-red-500 flex items-center justify-center text-3xl text-white">
          Slide 1
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="h-screen bg-green-500 flex items-center justify-center text-3xl text-white">
          Slide 2
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="h-screen bg-blue-500 flex items-center justify-center text-3xl text-white">
          Slide 3
        </div>
      ),
    },
  ];
  return <FullPageSlider slides={slides} />;
};

export default HowItWorks;

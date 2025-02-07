import SmoothScrollSlides from "@/components/SmoothScrollSlides";

const HowItWorks = () => {
  const slides = [
    "Slide 1 Content",
    "Slide 2 Content",
    "Slide 3 Content",
    "Slide 4 Content",
  ];
  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <SmoothScrollSlides slides={slides} />
    </div>
  );
};

export default HowItWorks;

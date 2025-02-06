const NoiseLayer = () => {
  return (
    <div
      style={{
        backgroundSize: "109px",
        backgroundRepeat: "repeat",
        backgroundImage: "url('/images/theNoise.png')",
        opacity: 0.075,
      }}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
};

export default NoiseLayer;

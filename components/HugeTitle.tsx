const HugeTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-5xl md:text-6xl lg:text-7xl font-bold">{children}</div>
  );
};

export default HugeTitle;

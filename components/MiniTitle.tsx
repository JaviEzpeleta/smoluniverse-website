const MiniTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-xl md:text-2xl lg:text-3xl font-bold">{children}</div>
  );
};

export default MiniTitle;

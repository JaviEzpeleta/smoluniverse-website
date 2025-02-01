const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-2xl md:text-3xl lg:text-4xl font-bold">{children}</div>
  );
};

export default Title;

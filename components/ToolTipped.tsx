import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ToolTipped = ({
  text,
  children,
  side = "top",
  disabled,
}: {
  text: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  disabled?: boolean;
}) => {
  if (disabled) return <>{children}</>;

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip disableHoverableContent={true}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="bg-black/15 backdrop-blur-lg border-2 border-white/30"
          side={side}
        >
          <p className="text-sm max-w-xs text-white py-1 px-2 font-shantellSans font-medium">
            {text}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTipped;

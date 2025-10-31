import * as React from "react";

import { cn } from "@/lib/utils";

export interface ScrollAreaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal" | "both";
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    const overflowClasses =
      orientation === "both"
        ? "overflow-auto"
        : orientation === "horizontal"
          ? "overflow-x-auto"
          : "overflow-y-auto";

    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:w-2.5",
          overflowClasses,
          className,
        )}
        {...props}
      />
    );
  },
);

ScrollArea.displayName = "ScrollArea";


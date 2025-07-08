import React from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const glowVariants = cva("absolute w-full pointer-events-none", {
  variants: {
    variant: {
      top: "top-0",
      above: "-top-[128px]",
      center: "top-[50%]",
      below: "-bottom-[128px]",
      bottom: "bottom-0",
    },
    color: {
      primary: "",
      purple: "",
      blue: "",
      pink: "",
      emerald: "",
      amber: "",
    },
    intensity: {
      subtle: "",
      normal: "",
      strong: "",
    },
  },
  defaultVariants: { 
    variant: "top", 
    color: "primary",
    intensity: "normal",
  },
});

const colorMap = {
  primary: {
    outer: "hsla(var(--brand-foreground)/.5)",
    inner: "hsla(var(--brand)/.3)",
  },
  purple: {
    outer: "hsla(263, 85%, 75%/.4)",
    inner: "hsla(263, 85%, 65%/.3)",
  },
  blue: {
    outer: "hsla(220, 85%, 75%/.4)",
    inner: "hsla(220, 85%, 65%/.3)",
  },
  pink: {
    outer: "hsla(320, 70%, 80%/.4)",
    inner: "hsla(320, 70%, 70%/.3)",
  },
  emerald: {
    outer: "hsla(142, 71%, 65%/.4)",
    inner: "hsla(142, 71%, 55%/.3)",
  },
  amber: {
    outer: "hsla(38, 92%, 70%/.4)",
    inner: "hsla(38, 92%, 60%/.3)",
  },
};

const intensityMap = {
  subtle: { outerOpacity: "10%", innerOpacity: "5%" },
  normal: { outerOpacity: "10%", innerOpacity: "10%" },
  strong: { outerOpacity: "15%", innerOpacity: "20%" },
};

const Glow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glowVariants>
>(({ className, variant, color = "primary", intensity = "normal", ...props }, ref) => {
  const colors = colorMap[color];
  const opacities = intensityMap[intensity];

  return (
    <div ref={ref} className={cn(glowVariants({ variant, color, intensity }), className)} {...props}>
      {/* Outer soft halo */}
      <div
        className={cn(
          "absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%]",
          "sm:h-[512px]",
          variant === "center" && "-translate-y-1/2"
        )}
        style={{
          background: `radial-gradient(ellipse at center, ${colors.outer} ${opacities.outerOpacity}, transparent 60%)`
        }}
      />
      {/* Inner brighter core */}
      <div
        className={cn(
          "absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%]",
          "sm:h-[256px]",
          variant === "center" && "-translate-y-1/2"
        )}
        style={{
          background: `radial-gradient(ellipse at center, ${colors.inner} ${opacities.innerOpacity}, transparent 60%)`
        }}
      />
    </div>
  );
});

Glow.displayName = "Glow";

export { Glow };

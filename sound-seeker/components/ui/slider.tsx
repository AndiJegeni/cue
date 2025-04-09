"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbClassName?: string
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, thumbClassName, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
        <SliderPrimitive.Range className="absolute h-full bg-black" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-5 w-5 rounded-full border-2 border-white bg-black ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50",
          thumbClassName,
        )}
      />
    </SliderPrimitive.Root>
  ),
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Lock } from "lucide-react";
import { Button } from "./ui/button";

export function TooltipComponent({
  title,
  showTip,
  className,
  description,
  ctaClick,
  ctaLabel,
  children,
}: {
  title: string;
  showTip: boolean;
  className?: string;
  description: string;
  ctaLabel?: string;
  ctaClick?: () => void;
  children: React.ReactNode;
}) {
  if (showTip) return <>{children}</>;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div className={cn("relative", className)}>
          <div className="pointer-events-none opacity-50 select-none">
            {children}
          </div>
          <div className="absolute inset-0 cursor-not-allowed" />
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs p-0 overflow-hidden border-border"
      >
        <div className="bg-card p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs font-semibold text-foreground">{title}</div>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed text-wrap">
              {description}
            </p>
          )}
          {ctaClick && ctaClick && (
            <Button
              asChild
              size="sm"
              className="w-full text-xs h-7"
              onClick={ctaClick}
            >
              <span>
                {ctaLabel}
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>
            </Button>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

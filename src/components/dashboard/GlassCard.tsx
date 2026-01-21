import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const GlassCard = ({
  title,
  description,
  icon: Icon,
  isActive = false,
  onClick,
  children,
  className,
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass-card-hover rounded-2xl p-6 cursor-pointer",
        isActive && "ring-2 ring-primary",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default GlassCard;

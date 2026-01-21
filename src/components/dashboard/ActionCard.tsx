import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

const ActionCard = ({ title, description, icon: Icon, onClick }: ActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center",
        "shadow-card transition-all duration-300 ease-out",
        "hover:border-primary/30 hover:bg-card-hover hover:shadow-card-hover hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        "active:scale-[0.98]"
      )}
    >
      {/* Icon Container */}
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl",
          "bg-accent transition-colors duration-300",
          "group-hover:bg-primary"
        )}
      >
        <Icon
          className={cn(
            "h-8 w-8 text-icon-primary transition-colors duration-300",
            "group-hover:text-primary-foreground"
          )}
        />
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Subtle hover indicator */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-t-full bg-primary",
          "transition-all duration-300 group-hover:w-16"
        )}
      />
    </button>
  );
};

export default ActionCard;

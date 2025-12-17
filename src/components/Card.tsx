import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export default function Card({ children, className = "", title, action }: CardProps) {
  return (
    <div className={`surface-card rounded-3xl p-4 ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b surface-divider flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-primary">{title}</h3>}
          {action}
        </div>
      )}

      <div className={title || action ? "p-6" : ""}>
        {children}
      </div>
    </div>
  );
}

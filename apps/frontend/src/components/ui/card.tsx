"use client";
// shadcn/ui: card — copy from shadcn/ui registry when scaffolding
export function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

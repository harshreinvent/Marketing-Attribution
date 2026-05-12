"use client";
// shadcn/ui: badge — copy from shadcn/ui registry when scaffolding
export function Badge({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

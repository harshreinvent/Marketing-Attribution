"use client";
// shadcn/ui: table — copy from shadcn/ui registry when scaffolding
export function Table({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

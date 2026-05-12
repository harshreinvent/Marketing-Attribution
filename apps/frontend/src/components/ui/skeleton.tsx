"use client";
// shadcn/ui: skeleton — copy from shadcn/ui registry when scaffolding
export function Skeleton({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

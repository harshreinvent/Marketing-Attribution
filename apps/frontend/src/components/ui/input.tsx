"use client";
// shadcn/ui: input — copy from shadcn/ui registry when scaffolding
export function Input({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

"use client";
// shadcn/ui: button — copy from shadcn/ui registry when scaffolding
export function Button({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

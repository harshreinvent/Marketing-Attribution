"use client";
// shadcn/ui: dialog — copy from shadcn/ui registry when scaffolding
export function Dialog({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

"use client";
// shadcn/ui: dropdown-menu — copy from shadcn/ui registry when scaffolding
export function DropdownMenu({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

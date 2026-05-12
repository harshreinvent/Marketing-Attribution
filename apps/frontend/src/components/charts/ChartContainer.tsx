import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

type Props = {
  title?: string;
  isEmpty?: boolean;
  isError?: boolean;
  children: React.ReactNode;
};

export function ChartContainer({ title, isEmpty, isError, children }: Props) {
  return (
    <div className="bg-card border rounded-lg p-4">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      {isError ? <ErrorState /> : isEmpty ? <EmptyState /> : children}
    </div>
  );
}

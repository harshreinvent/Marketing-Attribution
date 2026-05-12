type Props = { message?: string };

export function EmptyState({ message = "No data for this period" }: Props) {
  return (
    <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
      {message}
    </div>
  );
}

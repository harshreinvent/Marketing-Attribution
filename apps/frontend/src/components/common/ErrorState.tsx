type Props = { message?: string };

export function ErrorState({ message = "Failed to load data" }: Props) {
  return (
    <div className="flex items-center justify-center h-40 text-sm text-destructive">
      {message}
    </div>
  );
}

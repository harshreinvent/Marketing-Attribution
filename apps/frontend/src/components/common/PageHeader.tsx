type Props = { title: string; description?: string };

export function PageHeader({ title, description }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}

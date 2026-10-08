export function Placeholder({ title }: { title: string }) {
  return (
    <div className="grid min-h-[50dvh] place-items-center text-center">
      <div>
        <h1 className="text-heading font-semibold">{title}</h1>
        <p className="mt-1 text-body text-muted-foreground">Coming soon.</p>
      </div>
    </div>
  )
}
interface CatalogHeadingProps {
  semestre: string
}

export default function CatalogHeading({ semestre }: CatalogHeadingProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-bold text-[28px] sm:text-[32px] text-ui-dark tracking-tight leading-tight">
        Catálogo de Matérias
      </h1>
      <p className="text-base text-ui-muted leading-6">
        Selecione as disciplinas para o semestre{' '}
        <span className="font-medium text-brand-accent">{semestre}</span>
      </p>
    </div>
  )
}

import { Link } from "@tanstack/react-router";
import { XLogo } from "./XLogo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <XLogo className="h-9 w-9" />
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-display text-sm">X BJJ School</span>
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground">BRAZILIAN JIU-JITSU</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#programa" className="text-muted-foreground transition hover:text-foreground">Treinos</a>
          <a href="#metodo" className="text-muted-foreground transition hover:text-foreground">Método</a>
          <a href="#historia" className="text-muted-foreground transition hover:text-foreground">História</a>
          <Link to="/entrar" className="text-muted-foreground transition hover:text-foreground">Área do Aluno</Link>
        </nav>

        <Link
          to="/agendar"
          className="text-display rounded-sm bg-primary px-4 py-2.5 text-xs text-primary-foreground transition hover:bg-primary/90"
        >
          Aula Experimental
        </Link>
      </div>
    </header>
  );
}

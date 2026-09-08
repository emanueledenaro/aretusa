import * as React from "react";
import { createRoot } from "react-dom/client";
import { TanStackFormExample } from "./example";
import "./styles.css";

function App() {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  return (
    <main className="mx-auto grid w-full max-w-xl gap-8 px-4 py-8">
      <header className="grid gap-3">
        <p className="text-sm text-muted">Aretusa / Forms</p>
        <h1 className="text-3xl font-medium">Studio visit request</h1>
        <p className="text-sm text-muted">
          A TanStack Form example with validation and companions. Use the name
          "reserved" to try an asynchronous validation error.
        </p>
        <button
          type="button"
          className="a-button min-h-11 bg-surface px-4 py-2 text-sm"
          aria-pressed={dark}
          onClick={() => setDark(!dark)}
        >
          Dark theme
        </button>
      </header>
      <TanStackFormExample />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

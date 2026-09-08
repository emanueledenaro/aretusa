import * as React from "react";
import { Button, Card, CardTitle, CardDescription } from "./basic";
import { Accordion, NavigationMenu } from "./navigation";
import { Input, Field } from "./forms";
export function HeaderBlock({
  name,
  links,
  action,
}: {
  name: string;
  links: { label: string; href: string }[];
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5">
      <a href="#top" className="font-editorial text-2xl">
        {name}
      </a>
      <NavigationMenu items={links} />
      {action}
    </header>
  );
}
export function HeroBlock({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="grid items-center gap-8 py-16 md:grid-cols-[1.2fr_1fr]">
      <div>
        <p className="mb-6 text-xs uppercase tracking-widest text-muted">
          {eyebrow}
        </p>
        <h1 className="font-editorial text-4xl leading-tight tracking-tight md:text-5xl">
          {title}
        </h1>
      </div>
      <div>
        <p className="text-lg leading-relaxed text-muted">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </section>
  );
}
export function EditorialBlock({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-8 border-t border-line py-12 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
        <h2 className="mt-5 font-editorial text-3xl">{title}</h2>
      </div>
      <div className="space-y-4 leading-relaxed text-muted">{children}</div>
    </section>
  );
}
export function FeatureGrid({
  items,
}: {
  items: { title: string; description: string }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((i) => (
        <Card key={i.title}>
          <CardTitle>{i.title}</CardTitle>
          <CardDescription className="mt-4">{i.description}</CardDescription>
        </Card>
      ))}
    </div>
  );
}
export function FAQBlock({
  title,
  items,
}: {
  title: string;
  items: { title: string; content: React.ReactNode }[];
}) {
  return (
    <section className="py-12">
      <h2 className="mb-6 font-editorial text-3xl">{title}</h2>
      <Accordion items={items} />
    </section>
  );
}
export function CTABlock({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-surface p-8 md:p-12">
      <h2 className="font-editorial text-3xl">{title}</h2>
      <div className="my-4 max-w-xl text-muted">{children}</div>
      {action}
    </section>
  );
}
export function FooterBlock({
  name,
  links,
}: {
  name: string;
  links: { label: string; href: string }[];
}) {
  return (
    <footer className="mt-12 flex flex-wrap justify-between gap-6 border-t border-line py-8">
      <span className="font-editorial text-xl">{name}</span>
      <NavigationMenu items={links} />
    </footer>
  );
}
export function FormBlock({
  onSubmit,
}: {
  onSubmit: (data: { name: string; email: string }) => void;
}) {
  return (
    <form
      className="max-w-sm space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        onSubmit({
          name: String(d.get("name")),
          email: String(d.get("email")),
        });
      }}
    >
      <Field label="Your name">
        <Input name="name" autoComplete="name" required />
      </Field>
      <Field label="Email" hint="Used only for this example.">
        <Input type="email" name="email" autoComplete="email" required />
      </Field>
      <Button type="submit">Continue</Button>
    </form>
  );
}

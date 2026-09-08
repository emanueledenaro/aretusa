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

export function LoginBlock({onSubmit}:{onSubmit:(data:{email:string;password:string})=>Promise<void>|void}){
 const [busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
 return <div className="mx-auto w-full max-w-sm py-8"><div className="mb-7"><p className="font-editorial text-3xl tracking-tight">Welcome back.</p><p className="mt-3 text-sm text-muted">A familiar place to pick up where you left off.</p></div><form className="space-y-5" onSubmit={async e=>{e.preventDefault();const form=new FormData(e.currentTarget);setBusy(true);setError('');try{await onSubmit({email:String(form.get('email')),password:String(form.get('password'))})}catch{setError('Sign in could not be completed. Please try again.')}finally{setBusy(false)}}}><Field label="Email"><Input type="email" name="email" autoComplete="username" required placeholder="you@example.com"/></Field><Field label="Password" error={error||undefined}><Input name="password" type="password" autoComplete="current-password" required minLength={8}/></Field><Button className="w-full" type="submit" loading={busy}>Sign in</Button></form><p className="mt-6 text-center text-xs text-muted">Your work, right where you left it.</p></div>
}
export function SignupBlock({onSubmit}:{onSubmit:(data:{name:string;email:string;password:string})=>Promise<void>|void}){
 const [busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
 return <div className="mx-auto w-full max-w-sm py-8"><div className="mb-7"><p className="font-editorial text-3xl tracking-tight">A new beginning.</p><p className="mt-3 text-sm text-muted">Make a little space for your next idea.</p></div><form className="space-y-5" onSubmit={async e=>{e.preventDefault();const d=new FormData(e.currentTarget);setBusy(true);setError('');try{await onSubmit({name:String(d.get('name')),email:String(d.get('email')),password:String(d.get('password'))})}catch{setError('We could not complete this step. Please try again.')}finally{setBusy(false)}}}><Field label="Your name"><Input name="name" autoComplete="name" required/></Field><Field label="Email"><Input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></Field><Field label="Password" hint="Use at least eight characters." error={error||undefined}><Input name="password" type="password" autoComplete="new-password" required minLength={8}/></Field><Button type="submit" className="w-full" loading={busy}>Create account</Button></form></div>
}
export function ApplicationShell({name,items,active,onNavigate,action,children}:{name:string;items:string[];active:string;onNavigate:(name:string)=>void;action?:React.ReactNode;children:React.ReactNode}){const [expanded,setExpanded]=React.useState(true);return <div className="flex min-h-[420px] overflow-hidden rounded-xl border border-line bg-paper"><aside className={(expanded?'w-48':'w-16')+' shrink-0 border-e border-line bg-card p-3 transition-[width] motion-reduce:transition-none'}><Button size="sm" tone="quiet" aria-label={expanded?'Collapse sidebar':'Expand sidebar'} onClick={()=>setExpanded(!expanded)}>{expanded?name:name.slice(0,1)}</Button><nav aria-label="Workspace" className="mt-6 space-y-1">{items.map(i=><button key={i} title={expanded?undefined:i} onClick={()=>onNavigate(i)} aria-current={active===i?'page':undefined} className={'block w-full overflow-hidden rounded-md px-3 py-2 text-start text-xs '+(active===i?'bg-surface text-ink':'text-muted hover:bg-surface')}>{expanded?i:i.slice(0,1)}</button>)}</nav></aside><div className="min-w-0 flex-1"><header className="flex min-h-16 items-center justify-between border-b border-line px-5"><h2 className="text-sm font-medium">{active}</h2>{action}</header><div className="p-5">{children}</div></div></div>}

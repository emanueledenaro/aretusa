import * as React from "react";
import {
  Dialog as D,
  AlertDialog as A,
  Popover as P,
  Tooltip as T,
  HoverCard as H,
  Toast as RT,
} from "radix-ui";
import { X } from "lucide-react";
import { Button } from "./basic";
import { cx } from "./utils";
type ModalProps = {
  trigger?: React.ReactElement;
  title: string;
  description: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  footer?: React.ReactNode;
  placement?: "center" | "right" | "bottom";
};
export function Modal({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  footer,
  placement = "center",
}: ModalProps) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <D.Trigger asChild>{trigger}</D.Trigger>}
      <D.Portal>
        <D.Overlay className="a-overlay" />
        <D.Content
          className={cx(
            "fixed z-50 flex max-h-[90dvh] flex-col border border-line bg-card text-ink shadow-xl outline-none",
            placement === "center"
              ? "left-1/2 top-1/2 w-[min(560px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl"
              : placement === "right"
                ? "right-0 top-0 h-dvh max-h-dvh w-[min(460px,100%)]"
                : "bottom-0 left-0 right-0 max-h-[85dvh] rounded-t-2xl",
          )}
        >
          <div className="border-b border-line px-6 py-5 pe-14">
            <D.Title className="font-editorial text-2xl">{title}</D.Title>
            <D.Description className="mt-2 text-sm text-muted">
              {description}
            </D.Description>
          </div>
          <div className="overflow-y-auto p-6">{children}</div>
          {footer && (
            <div className="flex flex-wrap justify-end gap-3 border-t border-line p-5">
              {footer}
            </div>
          )}
          <D.Close
            aria-label="Close dialog"
            className="absolute end-4 top-4 rounded-md p-2 hover:bg-surface"
          >
            <X className="size-4" />
          </D.Close>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
export const Dialog = Modal;
export function Sheet(props: Omit<ModalProps, "placement">) {
  return <Modal {...props} placement="right" />;
}
export function Drawer(props: Omit<ModalProps, "placement">) {
  return <Modal {...props} placement="bottom" />;
}
export function AlertDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
}: {
  trigger: React.ReactElement;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
}) {
  return (
    <A.Root>
      <A.Trigger asChild>{trigger}</A.Trigger>
      <A.Portal>
        <A.Overlay className="a-overlay" />
        <A.Content className="fixed left-1/2 top-1/2 z-50 w-[min(480px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-card p-6 text-ink shadow-xl">
          <A.Title className="font-editorial text-2xl">{title}</A.Title>
          <A.Description className="my-4 text-sm leading-relaxed text-muted">
            {description}
          </A.Description>
          <div className="flex justify-end gap-3">
            <A.Cancel asChild>
              <Button tone="outline">Cancel</Button>
            </A.Cancel>
            <A.Action asChild>
              <Button tone="danger" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </A.Action>
          </div>
        </A.Content>
      </A.Portal>
    </A.Root>
  );
}
export function Popover({
  trigger,
  children,
  label,
}: {
  trigger: React.ReactElement;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <P.Root>
      <P.Trigger asChild>{trigger}</P.Trigger>
      <P.Portal>
        <P.Content
          aria-label={label}
          sideOffset={8}
          className="a-popup w-72 p-5"
        >
          {children}
          <P.Close
            aria-label="Close popover"
            className="absolute end-1 top-1 p-1"
          >
            <X className="size-3" />
          </P.Close>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
export function Tooltip({
  children,
  content,
}: {
  children: React.ReactElement;
  content: string;
}) {
  return (
    <T.Provider delayDuration={250}>
      <T.Root>
        <T.Trigger asChild>{children}</T.Trigger>
        <T.Portal>
          <T.Content
            sideOffset={6}
            className="z-[60] rounded-md bg-ink px-3 py-2 text-xs text-paper"
          >
            {content}
            <T.Arrow className="fill-ink" />
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  );
}
export function HoverCard({
  trigger,
  children,
}: {
  trigger: React.ReactElement;
  children: React.ReactNode;
}) {
  return (
    <H.Root>
      <H.Trigger asChild>{trigger}</H.Trigger>
      <H.Portal>
        <H.Content sideOffset={8} className="a-popup w-72 p-5">
          {children}
        </H.Content>
      </H.Portal>
    </H.Root>
  );
}
export function Toast({open,onOpenChange,title,description,duration=5000}:{open:boolean;onOpenChange:(open:boolean)=>void;title:string;description?:string;duration?:number}){
 return <RT.Provider swipeDirection="right" duration={duration}><RT.Root open={open} onOpenChange={onOpenChange} className="rounded-xl border border-line bg-card p-5 text-ink shadow-xl"><RT.Title className="font-medium">{title}</RT.Title>{description&&<RT.Description className="mt-1 text-sm text-muted">{description}</RT.Description>}<RT.Close className="mt-3 text-sm underline">Dismiss</RT.Close></RT.Root><RT.Viewport className="fixed bottom-4 right-4 z-[70] m-0 w-[min(360px,calc(100%-32px))] list-none outline-none"/></RT.Provider>
}
export function ToastDemo(){const [open,setOpen]=React.useState(false);return <><Button tone="outline" onClick={()=>setOpen(true)}>Show notification</Button><Toast open={open} onOpenChange={setOpen} title="Changes saved" description="Your local example has been updated."/></>}

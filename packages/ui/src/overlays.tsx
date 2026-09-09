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
import { Button } from "./button";
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
  const previousFocus = React.useRef<HTMLElement | null>(null);
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <D.Trigger asChild>{trigger}</D.Trigger>}
      <D.Portal>
        <D.Overlay className="a-overlay" />
        <D.Content
          onOpenAutoFocus={() => {
            previousFocus.current = document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null;
          }}
          onCloseAutoFocus={(event) => {
            if (!trigger && previousFocus.current?.isConnected) {
              event.preventDefault();
              previousFocus.current.focus({ preventScroll: true });
            }
          }}
          className={cx(
            "a-modal-content fixed z-50 flex max-h-[90dvh] flex-col border border-line bg-card text-ink shadow-xl outline-none",
            placement === "center"
              ? "left-1/2 top-1/2 w-[min(560px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl"
              : placement === "right"
                ? "right-0 top-0 h-dvh max-h-dvh w-[min(460px,100%)]"
                : "bottom-0 left-1/2 w-full max-w-3xl -translate-x-1/2 max-h-[85dvh] rounded-t-2xl",
          )}
        >
          <div className="border-b border-line px-6 pb-5 pt-6 pe-16 sm:px-7 sm:pt-7">
            <D.Title className="font-editorial text-[1.625rem] leading-tight tracking-tight sm:text-[1.75rem]">
              {title}
            </D.Title>
            <D.Description className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-muted">
              {description}
            </D.Description>
          </div>
          <div className="a-scrollbar min-h-0 overflow-y-auto overscroll-contain px-6 py-6 sm:px-7">
            {children}
          </div>
          {footer && (
            <div className="mt-auto flex flex-col-reverse gap-2 border-t border-line px-6 py-5 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3 sm:px-7 [&>.a-button]:w-full sm:[&>.a-button]:w-auto">
              {footer}
            </div>
          )}
          <D.Close
            aria-label="Close dialog"
            className="a-close absolute end-4 top-4 flex size-10 items-center justify-center rounded-full border border-transparent text-muted transition-colors hover:border-line hover:bg-surface hover:text-ink sm:end-5 sm:top-5"
          >
            <X className="size-4" strokeWidth={1.75} />
          </D.Close>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
export const Dialog = Modal;
/** Wraps a footer action so activating it closes the surrounding Modal, Sheet or Drawer. */
export function ModalClose({ children }: { children: React.ReactElement }) {
  return <D.Close asChild>{children}</D.Close>;
}
export function Sheet(props: Omit<ModalProps, "placement">) {
  return <Modal {...props} placement="right" />;
}
export function Drawer(props: Omit<ModalProps, "placement">) {
  return <Modal {...props} placement="bottom" />;
}
export type AlertDialogProps = {
  trigger?: React.ReactElement;
  title: string;
  description: React.ReactNode;
  /** Return a promise to keep the dialog open with a pending confirmation. A rejection shows its message and allows a retry. */
  onConfirm: () => void | Promise<unknown>;
  confirmLabel?: string;
  cancelLabel?: string;
  /** danger marks an irreversible action; neutral asks for a decision. */
  tone?: "danger" | "neutral";
  /** Short eyebrow above the title. Defaults to the tone's wording; pass an empty string to hide it. */
  label?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional detail between the description and the actions, such as what will be affected. */
  children?: React.ReactNode;
};
export function AlertDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  label = tone === "danger" ? "Irreversible action" : "Before you continue",
  open,
  onOpenChange,
  children,
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const isOpen = open ?? internalOpen;
  const errorId = React.useId();
  const setOpen = (next: boolean) => {
    if (!next && pending) return;
    if (!next) setError("");
    setInternalOpen(next);
    onOpenChange?.(next);
  };
  const confirm = async (event: React.MouseEvent) => {
    event.preventDefault();
    setError("");
    try {
      setPending(true);
      await onConfirm();
      setPending(false);
      setInternalOpen(false);
      onOpenChange?.(false);
    } catch (reason) {
      setPending(false);
      setError(
        reason instanceof Error && reason.message
          ? reason.message
          : "Something went wrong. Try again.",
      );
    }
  };
  return (
    <A.Root open={isOpen} onOpenChange={setOpen}>
      {trigger && <A.Trigger asChild>{trigger}</A.Trigger>}
      <A.Portal>
        <A.Overlay className="a-overlay" />
        <A.Content
          onEscapeKeyDown={(event) => {
            if (pending) event.preventDefault();
          }}
          className="a-modal-content a-alert fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[min(460px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-2xl border border-line bg-card text-ink shadow-xl outline-none"
        >
          <div className="px-6 pt-6 sm:px-7 sm:pt-7">
            {label && (
              <p
                aria-hidden="true"
                className={cx(
                  "mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.12em]",
                  tone === "danger" ? "text-danger" : "text-muted",
                )}
              >
                {label}
              </p>
            )}
            <A.Title className="font-editorial text-[1.625rem] leading-tight tracking-tight sm:text-[1.75rem]">
              {title}
            </A.Title>
            <A.Description className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-muted">
              {description}
            </A.Description>
            {children && <div className="mt-4 text-sm leading-relaxed">{children}</div>}
            {error && (
              <p
                id={errorId}
                role="alert"
                className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm leading-relaxed text-danger"
              >
                {error}
              </p>
            )}
          </div>
          <div className="mx-6 mt-6 border-t border-line sm:mx-7" />
          <div className="flex flex-col-reverse gap-2 px-6 py-5 sm:flex-row sm:justify-end sm:gap-3 sm:px-7">
            <A.Cancel asChild>
              <Button tone="outline" disabled={pending} className="w-full sm:w-auto">
                {cancelLabel}
              </Button>
            </A.Cancel>
            <A.Action asChild>
              <Button
                tone={tone === "danger" ? "danger" : "primary"}
                loading={pending}
                aria-describedby={error ? errorId : undefined}
                onClick={confirm}
                className="w-full sm:w-auto"
              >
                {confirmLabel}
              </Button>
            </A.Action>
          </div>
        </A.Content>
      </A.Portal>
    </A.Root>
  );
}
export type PopoverProps = {
  /** Element that opens the popover. Omit it when `open` is controlled from elsewhere. */
  trigger?: React.ReactElement;
  children: React.ReactNode;
  /** Accessible name when there is no visible title. */
  label?: string;
  /** Visible heading; also names the surface. */
  title?: string;
  /** Short text under the title, linked as the accessible description. */
  description?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** Surface width before the viewport cap: sm 240px, md 320px, lg 400px. */
  width?: "sm" | "md" | "lg";
  /** Hide the round close control when the content has its own closing action. */
  hideClose?: boolean;
  className?: string;
};
export function Popover({
  trigger,
  children,
  label,
  title,
  description,
  open,
  defaultOpen,
  onOpenChange,
  side = "bottom",
  align = "center",
  width = "md",
  hideClose = false,
  className,
}: PopoverProps) {
  const id = React.useId();
  const titleId = title ? id + "-title" : undefined;
  const descriptionId = description ? id + "-description" : undefined;
  return (
    <P.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <P.Trigger asChild>{trigger}</P.Trigger>}
      <P.Portal>
        <P.Content
          aria-label={title ? undefined : label}
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          side={side}
          align={align}
          sideOffset={8}
          collisionPadding={12}
          className={cx(
            "a-popup a-scrollbar relative p-0 outline-none",
            width === "sm" ? "w-60" : width === "lg" ? "w-[400px]" : "w-80",
            className,
          )}
        >
          {(title || description) && (
            <div className={cx("px-5 pt-5", hideClose ? "" : "pe-14")}>
              {title && (
                <h3 id={titleId} className="font-editorial text-[1.125rem] leading-snug tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p id={descriptionId} className="mt-1 text-sm leading-relaxed text-muted">
                  {description}
                </p>
              )}
            </div>
          )}
          <div className={cx("px-5 pb-5", title || description ? "pt-4" : hideClose ? "pt-5" : "pt-5 pe-14")}>
            {children}
          </div>
          {!hideClose && (
            <P.Close
              aria-label="Close"
              className="a-close absolute end-2 top-2 flex size-10 items-center justify-center rounded-full border border-transparent text-muted transition-colors hover:border-line hover:bg-surface hover:text-ink"
            >
              <X className="size-4" strokeWidth={1.75} />
            </P.Close>
          )}
          <P.Arrow width={14} height={7} className="fill-card stroke-line [stroke-width:1px]" />
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
            className="a-tooltip z-[60] rounded-md bg-ink px-3 py-2 text-xs text-paper"
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
 return <RT.Provider swipeDirection="right" duration={duration}><RT.Root open={open} onOpenChange={onOpenChange} className="a-toast rounded-xl border border-line bg-card p-5 text-ink shadow-xl"><RT.Title className="font-medium">{title}</RT.Title>{description&&<RT.Description className="mt-1 text-sm text-muted">{description}</RT.Description>}<RT.Close className="mt-3 text-sm underline">Dismiss</RT.Close></RT.Root><RT.Viewport className="fixed bottom-4 right-4 z-[70] m-0 w-[min(360px,calc(100%-32px))] list-none outline-none"/></RT.Provider>
}
export function ToastDemo(){const [open,setOpen]=React.useState(false);return <><Button tone="outline" onClick={()=>setOpen(true)}>Show notification</Button><Toast open={open} onOpenChange={setOpen} title="Changes saved" description="Your local example has been updated."/></>}

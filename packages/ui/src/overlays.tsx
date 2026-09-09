import * as React from "react";
import {
  Dialog as D,
  AlertDialog as A,
  Popover as P,
  Tooltip as T,
  HoverCard as H,
  Toast as RT,
} from "radix-ui";
import { X, CircleCheck, CircleAlert } from "lucide-react";
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
const TooltipProviderContext = React.createContext(false);
/** Wrap a page or toolbar so several tooltips share one delay and skip it when moving between triggers. */
export function TooltipProvider({
  children,
  delay = 300,
  skipDelay = 400,
}: {
  children: React.ReactNode;
  delay?: number;
  skipDelay?: number;
}) {
  return (
    <TooltipProviderContext.Provider value={true}>
      <T.Provider delayDuration={delay} skipDelayDuration={skipDelay}>
        {children}
      </T.Provider>
    </TooltipProviderContext.Provider>
  );
}
export type TooltipProps = {
  /** The trigger. A disabled control is wrapped in a focusable span so the tooltip stays reachable. */
  children: React.ReactElement<{ disabled?: boolean }>;
  /** Short supplementary text. Keep essential information outside the tooltip. */
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** Milliseconds before a hover opens the tooltip. Focus opens immediately. */
  delay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};
export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delay = 300,
  open,
  defaultOpen,
  onOpenChange,
}: TooltipProps) {
  const shared = React.useContext(TooltipProviderContext);
  const disabled = Boolean(children.props.disabled);
  const trigger = disabled ? (
    <span tabIndex={0} className="inline-flex max-w-full rounded-lg">
      {children}
    </span>
  ) : (
    children
  );
  const root = (
    <T.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} delayDuration={delay} disableHoverableContent>
      <T.Trigger asChild>{trigger}</T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={12}
          className="a-tooltip z-[60] max-w-64 rounded-lg bg-ink px-3 py-2 text-[0.8125rem] leading-snug text-paper shadow-lg [overflow-wrap:anywhere]"
        >
          {content}
          <T.Arrow width={12} height={6} className="fill-ink" />
        </T.Content>
      </T.Portal>
    </T.Root>
  );
  return shared ? root : <T.Provider delayDuration={delay}>{root}</T.Provider>;
}
export type HoverCardProps = {
  /** A link or button that stays usable on its own; the card only adds context. */
  trigger: React.ReactElement;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** Milliseconds before a hover opens the card. Focus uses the same delay. */
  openDelay?: number;
  closeDelay?: number;
  /** Surface width before the viewport cap: sm 240px, md 320px, lg 400px. */
  width?: "sm" | "md" | "lg";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};
export function HoverCard({
  trigger,
  children,
  side = "bottom",
  align = "center",
  openDelay = 300,
  closeDelay = 150,
  width = "md",
  open,
  defaultOpen,
  onOpenChange,
  className,
}: HoverCardProps) {
  return (
    <H.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} openDelay={openDelay} closeDelay={closeDelay}>
      <H.Trigger asChild>{trigger}</H.Trigger>
      <H.Portal>
        <H.Content
          side={side}
          align={align}
          sideOffset={8}
          collisionPadding={12}
          className={cx(
            "a-popup a-scrollbar p-5 leading-relaxed",
            width === "sm" ? "w-60" : width === "lg" ? "w-[400px]" : "w-80",
            className,
          )}
        >
          {children}
          <H.Arrow width={14} height={7} className="fill-card stroke-line [stroke-width:1px]" />
        </H.Content>
      </H.Portal>
    </H.Root>
  );
}
export type ToastTone = "neutral" | "success" | "danger";
export type ToastOptions = {
  title: string;
  description?: string;
  /** Neutral by default; success and danger add an icon and colour. Danger is announced assertively. */
  tone?: ToastTone;
  /** Milliseconds before the notification closes on its own. Infinity keeps it until dismissed. */
  duration?: number;
  /** One optional action. It closes the notification after running. */
  action?: { label: string; onClick: () => void };
};
export type ToastProps = ToastOptions & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};
type QueuedToast = ToastOptions & { id: string };
type ToastApi = {
  /** Enqueue a notification and get its id back. */
  toast: (options: ToastOptions) => string;
  /** Dismiss one notification by id, or every notification when called without an id. */
  dismiss: (id?: string) => void;
};
const ToastContext = React.createContext<ToastApi | null>(null);
/** Read the queue API. Requires a ToastProvider above the caller. */
export function useToast(): ToastApi {
  const api = React.useContext(ToastContext);
  if (!api) throw new Error("useToast needs a ToastProvider above the component that calls it.");
  return api;
}
export type ToastProviderProps = {
  children: React.ReactNode;
  /** Default duration for notifications that do not set their own. */
  duration?: number;
  /** How many notifications stay visible; the oldest leave first. */
  limit?: number;
  /** Corner of the viewport that holds the notifications. */
  position?: "bottom-end" | "bottom-start" | "top-end" | "top-start";
};
/** Wrap the application once so any component can call useToast(). */
export function ToastProvider({ children, duration = 5000, limit = 3, position = "bottom-end" }: ToastProviderProps) {
  const [items, setItems] = React.useState<QueuedToast[]>([]);
  const counter = React.useRef(0);
  const api = React.useMemo<ToastApi>(
    () => ({
      toast(options) {
        counter.current += 1;
        const id = "toast-" + counter.current;
        setItems((list) => [...list, { ...options, id }].slice(-limit));
        return id;
      },
      dismiss(id) {
        setItems((list) => (id ? list.filter((item) => item.id !== id) : []));
      },
    }),
    [limit],
  );
  return (
    <ToastContext.Provider value={api}>
      <RT.Provider swipeDirection={position.endsWith("start") ? "left" : "right"} duration={duration}>
        {children}
        {items.map((item) => (
          <ToastItem key={item.id} {...item} open onOpenChange={(open) => !open && api.dismiss(item.id)} />
        ))}
        <ToastViewport position={position} />
      </RT.Provider>
    </ToastContext.Provider>
  );
}
function ToastViewport({ position = "bottom-end" }: { position?: ToastProviderProps["position"] }) {
  return (
    <RT.Viewport
      className={cx(
        "fixed z-[70] m-0 flex w-[min(360px,calc(100%-32px))] max-h-dvh list-none flex-col gap-3 p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
        position.startsWith("top") ? "top-[max(16px,env(safe-area-inset-top))]" : "bottom-[max(16px,env(safe-area-inset-bottom))]",
        position.endsWith("start") ? "start-[max(16px,env(safe-area-inset-left))]" : "end-[max(16px,env(safe-area-inset-right))]",
      )}
    />
  );
}
function ToastItem({ open, onOpenChange, title, description, tone = "neutral", duration, action, className }: ToastProps) {
  const Icon = tone === "success" ? CircleCheck : tone === "danger" ? CircleAlert : null;
  return (
    <RT.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      type={tone === "danger" || action ? "foreground" : "background"}
      data-tone={tone}
      className={cx(
        "a-toast relative flex items-start gap-3 rounded-xl border border-line bg-card p-4 pe-14 text-ink shadow-xl",
        "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:opacity-0",
        className,
      )}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          strokeWidth={1.75}
          className={cx("mt-0.5 size-5 shrink-0", tone === "success" ? "text-success" : "text-danger")}
        />
      )}
      <div className="min-w-0 flex-1">
        <RT.Title className="text-[0.9375rem] font-medium leading-snug">{title}</RT.Title>
        {description && <RT.Description className="mt-1 text-sm leading-relaxed text-muted">{description}</RT.Description>}
        {action && (
          <RT.Action asChild altText={action.label}>
            <Button size="sm" tone="outline" className="mt-3" onClick={action.onClick}>
              {action.label}
            </Button>
          </RT.Action>
        )}
      </div>
      <RT.Close
        aria-label="Dismiss"
        className="a-close absolute end-2 top-2 flex size-10 items-center justify-center rounded-full border border-transparent text-muted transition-colors hover:border-line hover:bg-surface hover:text-ink"
      >
        <X className="size-4" strokeWidth={1.75} />
      </RT.Close>
    </RT.Root>
  );
}
/** A controlled notification. Inside a ToastProvider it joins the shared stack; on its own it renders its own viewport. */
export function Toast(props: ToastProps) {
  const inProvider = React.useContext(ToastContext) !== null;
  if (inProvider) return <ToastItem {...props} />;
  return (
    <RT.Provider swipeDirection="right" duration={props.duration}>
      <ToastItem {...props} />
      <ToastViewport />
    </RT.Provider>
  );
}

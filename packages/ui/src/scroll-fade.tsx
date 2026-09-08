import * as React from "react";
import "./scroll-fade.css";

export interface ScrollFadeOptions {
  axis?: "vertical" | "horizontal" | "both";
  enabled?: boolean;
}

/** Physical edges, independent of the document's reading direction. */
export interface ScrollFadeEdges {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

const emptyEdges: ScrollFadeEdges = {
  top: false,
  bottom: false,
  left: false,
  right: false,
};

export function useScrollFade<T extends HTMLElement = HTMLDivElement>({
  axis = "vertical",
  enabled = true,
}: ScrollFadeOptions = {}) {
  const [node, ref] = React.useState<T | null>(null);
  const [edges, setEdges] = React.useState(emptyEdges);
  const refresh = React.useCallback(() => {
    if (!node || !enabled) return;
    const maxY = Math.max(0, node.scrollHeight - node.clientHeight);
    const y = Math.max(0, Math.min(maxY, node.scrollTop));
    const maxX = Math.max(0, node.scrollWidth - node.clientWidth);
    const rtl =
      node.ownerDocument.defaultView?.getComputedStyle(node).direction ===
      "rtl";
    // Current browsers use negative scrollLeft from the right-hand origin in RTL.
    const x = Math.max(
      0,
      Math.min(maxX, rtl ? maxX + node.scrollLeft : node.scrollLeft),
    );
    const next = {
      top: axis !== "horizontal" && y > 1,
      bottom: axis !== "horizontal" && maxY - y > 1,
      left: axis !== "vertical" && x > 1,
      right: axis !== "vertical" && maxX - x > 1,
    };
    setEdges((previous) =>
      previous.top === next.top &&
      previous.bottom === next.bottom &&
      previous.left === next.left &&
      previous.right === next.right
        ? previous
        : next,
    );
  }, [node, enabled, axis]);

  React.useEffect(() => {
    if (!node || !enabled) return;
    const view = node.ownerDocument.defaultView;
    const resize =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(refresh);
    const observed = new Set<Element>();
    const observeContent = () => {
      const current = new Set<Element>([node, ...node.querySelectorAll("*")]);
      for (const child of observed)
        if (!current.has(child)) {
          resize?.unobserve(child);
          observed.delete(child);
        }
      for (const child of current)
        if (!observed.has(child)) {
          resize?.observe(child);
          observed.add(child);
        }
    };
    observeContent();
    const mutations = new MutationObserver((records) => {
      if (records.some((record) => record.type === "childList"))
        observeContent();
      refresh();
    });
    mutations.observe(node, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    });
    const direction = new MutationObserver(refresh);
    for (
      let ancestor = node.parentElement;
      ancestor;
      ancestor = ancestor.parentElement
    ) {
      direction.observe(ancestor, {
        attributes: true,
        attributeFilter: ["dir", "class", "style"],
      });
    }
    refresh();
    node.addEventListener("scroll", refresh, { passive: true });
    node.addEventListener("load", refresh, true);
    view?.addEventListener("resize", refresh);
    let active = true;
    void node.ownerDocument.fonts?.ready.then(() => {
      if (active) refresh();
    });
    return () => {
      active = false;
      resize?.disconnect();
      mutations.disconnect();
      direction.disconnect();
      node.removeEventListener("scroll", refresh);
      node.removeEventListener("load", refresh, true);
      view?.removeEventListener("resize", refresh);
    };
  }, [node, enabled, refresh]);

  return { ref, edges: enabled && node ? edges : emptyEdges, refresh };
}

export interface ScrollFadeProps extends React.ComponentPropsWithRef<"div"> {
  edges: ScrollFadeEdges;
  /** CSS length or pixels. Each fade is capped at half the available dimension. */
  depth?: number | string;
  /** Match the surface behind the scroll container. */
  color?: string;
}

/** Place beside the viewport in a positioned parent of the same size. */
export function ScrollFade({
  edges,
  depth = 48,
  color = "var(--color-paper)",
  className = "",
  style,
  ...props
}: ScrollFadeProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={`a-scroll-fade ${className}`}
      style={
        {
          "--scroll-fade-depth":
            typeof depth === "number" ? `${Math.max(0, depth)}px` : depth,
          "--scroll-fade-color": color,
          ...style,
        } as React.CSSProperties
      }
      data-fade-top={edges.top}
      data-fade-bottom={edges.bottom}
      data-fade-left={edges.left}
      data-fade-right={edges.right}
    >
      <span data-edge="top" />
      <span data-edge="bottom" />
      <span data-edge="left" />
      <span data-edge="right" />
    </div>
  );
}

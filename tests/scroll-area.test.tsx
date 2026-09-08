import React from 'react';
import { test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollArea } from '../packages/ui/src/navigation';

test('scroll fades follow the remaining content and leave the end readable', () => {
  const original = globalThis.ResizeObserver;
  const disconnect = vi.fn();
  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect = disconnect; } as unknown as typeof ResizeObserver;
  try {
    const {container,unmount,rerender} = render(<ScrollArea fade label="Examples"><p>Content</p></ScrollArea>);
    const viewport = screen.getByRole('region', {name:'Examples'});
    Object.defineProperties(viewport, {scrollHeight:{value:600,configurable:true},clientHeight:{value:200,configurable:true},scrollTop:{value:0,writable:true,configurable:true}});
    fireEvent.scroll(viewport);
    const root = container.querySelector('.a-scroll-area');
    expect(root).toHaveAttribute('data-fade-top','false');
    expect(root).toHaveAttribute('data-fade-bottom','true');
    viewport.scrollTop = 150;
    fireEvent.scroll(viewport);
    expect(root).toHaveAttribute('data-fade-top','true');
    expect(root).toHaveAttribute('data-fade-bottom','true');
    viewport.scrollTop = 400;
    fireEvent.scroll(viewport);
    expect(root).toHaveAttribute('data-fade-bottom','false');
    expect(viewport).toHaveAttribute('tabindex','0');
    rerender(<ScrollArea fade={false} label="Examples"><p>Content</p></ScrollArea>);
    expect(root).toHaveAttribute('data-fade-top','false');
    expect(root).toHaveAttribute('data-fade-bottom','false');
    unmount();
    expect(disconnect).toHaveBeenCalled();
  } finally { globalThis.ResizeObserver = original; }
});

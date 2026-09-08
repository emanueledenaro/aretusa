import React from 'react';
import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreatePage } from '../apps/docs/src/ProductPages';
import { defaultTheme, themeCSS } from '../packages/ui/src/theme';

function previewConfig() {
  const source = screen.getByTitle('Live Aretusa preview').getAttribute('src')!;
  return JSON.parse(new URLSearchParams(source.split('?')[1]).get('theme')!);
}

test('Shuffle preserves locked settings and Reset restores the preset', async () => {
  const random = vi.spyOn(Math, 'random').mockReturnValue(0.99);
  try {
    render(<CreatePage />);
    await userEvent.click(screen.getByRole('button', {name:'Lock Radius'}));
    await userEvent.click(screen.getByRole('button', {name:'Shuffle'}));
    expect(previewConfig()).toMatchObject({radius:10, style:'aria',base:'olive'});
    await userEvent.click(screen.getByRole('button', {name:'Reset'}));
    expect(previewConfig()).toEqual(defaultTheme);
    expect(screen.getByRole('button', {name:'Lock Radius'})).toHaveAttribute('aria-pressed','false');
  } finally { random.mockRestore(); }
});

test('preview device buttons announce the selected mode', async () => {
  render(<CreatePage />);
  expect(screen.getByRole('button', {name:'Desktop preview'})).toHaveAttribute('aria-pressed','true');
  await userEvent.click(screen.getByRole('button', {name:'Mobile preview'}));
  expect(screen.getByRole('button', {name:'Mobile preview'})).toHaveAttribute('aria-pressed','true');
  expect(screen.getByRole('button', {name:'Desktop preview'})).toHaveAttribute('aria-pressed','false');
});

test('exported CSS is generated from the same preset as the preview', async () => {
  render(<CreatePage />);
  await userEvent.click(screen.getByRole('button', {name:'Shuffle'}));
  const expected = themeCSS(previewConfig());
  await userEvent.click(screen.getAllByRole('button', {name:'Get code'})[0]);
  const dialog = screen.getByRole('dialog', {name:'Take this starting point with you.'});
  expect(dialog.querySelector('pre')?.textContent).toBe(expected);
});

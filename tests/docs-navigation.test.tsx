import React from 'react';
import { test, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import userEvent from '@testing-library/user-event';
import { App } from '../apps/docs/src/App';
import { Landing } from '../apps/docs/src/ProductPages';

test('documentation exposes the active page and filters the component list', async () => {
  history.replaceState(null, '', '#/docs');
  render(<App />);
  const nav = within(screen.getByRole('navigation', {name:'Documentation'}));
  expect(nav.getByRole('link', {name:'Getting started'})).toHaveAttribute('aria-current','page');
  await userEvent.type(nav.getByRole('textbox', {name:'Filter components'}), ' switch ');
  expect(nav.getByRole('link', {name:'Switch'})).toHaveAttribute('href','#/components/switch');
  expect(nav.queryByRole('link', {name:'Button'})).not.toBeInTheDocument();
  await userEvent.clear(nav.getByRole('textbox', {name:'Filter components'}));
  await userEvent.type(nav.getByRole('textbox', {name:'Filter components'}), 'missingcomponent');
  expect(nav.getByRole('status')).toHaveTextContent('No matching components.');
});

test('documentation navigation can be expanded and collapsed', async () => {
  history.replaceState(null, '', '#/docs');
  render(<App />);
  const toggle = screen.getByRole('button', {name:'Browse documentation'});
  expect(toggle).toHaveAttribute('aria-expanded','false');
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded','true');
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded','false');
});

test('homepage contains a permanent fade without a reveal control', () => {
  const markup = renderToStaticMarkup(<Landing />);
  expect(markup).toContain('class="a-edge-fade"');
  expect(markup).not.toContain('Show without fade');
  expect(markup).not.toContain('Restore soft fade');
  expect(markup).not.toContain('data-revealed');
});

test('search Escape returns focus to the search button', async () => {
  history.replaceState(null, '', '#/docs');
  render(<App />);
  const trigger = screen.getByRole('button', {name:'Search documentation'});
  await userEvent.click(trigger);
  expect(screen.getByRole('combobox', {name:'Search components'})).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(trigger).toHaveFocus();
});

test('keyboard search keeps the active result visible and handles empty results', async () => {
  const original = HTMLElement.prototype.scrollIntoView;
  const scrolled: string[] = [];
  HTMLElement.prototype.scrollIntoView = function () { scrolled.push(this.id); };
  try {
    history.replaceState(null, '', '#/docs');
    render(<App />);
    await userEvent.click(screen.getByRole('button', {name:'Search documentation'}));
    const search = screen.getByRole('combobox', {name:'Search components'});
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(search).toHaveAttribute('aria-activedescendant','site-search-2');
    expect(scrolled).toContain('site-search-2');
    await userEvent.type(search, 'nomatchingcomponentxyz');
    expect(search).not.toHaveAttribute('aria-activedescendant');
    await userEvent.keyboard('{Enter}');
    expect(location.hash).toBe('#/docs');
    expect(screen.getByRole('status')).toHaveTextContent('No results');
  } finally { HTMLElement.prototype.scrollIntoView = original; }
});

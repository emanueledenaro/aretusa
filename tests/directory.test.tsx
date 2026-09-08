import React from 'react';
import {test,expect,vi} from 'vitest';
import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DirectoryPage} from '../apps/docs/src/ProductPages';

test('registry failure can be retried without reloading the page', async () => {
  const fetchMock=vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ok:true,json:async()=>({items:[{name:'button',description:'An action',type:'component',files:[],dependencies:[]}]})});
  vi.stubGlobal('fetch',fetchMock);
  try {
    render(<DirectoryPage/>);
    await screen.findByText('Registry unavailable');
    await userEvent.click(screen.getByRole('button',{name:'Try again'}));
    expect(await screen.findByRole('button',{name:/button component An action/})).toBeVisible();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  } finally {vi.unstubAllGlobals();}
});

test('invalid registry data produces a recoverable error', async () => {
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({items:null})}));
  try {render(<DirectoryPage/>);expect(await screen.findByRole('button',{name:'Try again'})).toBeVisible();}
  finally {vi.unstubAllGlobals();}
});

import React from 'react';
import {renderToString} from 'react-dom/server';
import {test,expect} from 'vitest';
import {catalog} from '../packages/ui/src/catalog';
import {Demo} from '../apps/docs/src/Demo';
test.each(catalog)('$name example renders actual content',entry=>{const html=renderToString(<Demo id={entry.id}/>);expect(html.length).toBeGreaterThan(80);expect(html).not.toContain('Choose a component')});

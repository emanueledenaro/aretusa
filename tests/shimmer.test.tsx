import React from 'react';
import {test,expect} from 'vitest';
import {render,screen} from '@testing-library/react';
import {Shimmer} from '../packages/ui/src/shimmer';

test('shimmer preserves one copy of the text and caller semantics',()=>{
 const ref=React.createRef<HTMLSpanElement>();
 const {rerender}=render(<Shimmer ref={ref} role="status" speed={4} highlight="#ffffff">Preparing notes</Shimmer>);
 expect(screen.getByRole('status')).toHaveTextContent('Preparing notes');
 expect(screen.getAllByText('Preparing notes')).toHaveLength(1);
 expect(ref.current?.style.getPropertyValue('--shimmer-duration')).toBe('4s');
 rerender(<Shimmer ref={ref} enabled={false}>Preparing notes</Shimmer>);
 expect(ref.current).toHaveAttribute('data-enabled','false');
});
test.each([0,-1,Infinity,NaN])('invalid speed %s uses a safe default',speed=>{
 const {container}=render(<Shimmer speed={speed}>Text</Shimmer>);
 expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--shimmer-duration')).toBe('2.8s');
});

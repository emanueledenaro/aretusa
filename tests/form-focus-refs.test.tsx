import React from 'react';
import {test,expect,vi} from 'vitest';
import {render,screen,act,fireEvent} from '@testing-library/react';
import {Select,RadioGroup,NativeSelect} from '../packages/ui/src/forms';

test('Select triggerRef focuses the actual combobox',()=>{
 const ref=React.createRef<HTMLButtonElement>();
 const onBlur=vi.fn();
 render(<Select label="Role" triggerRef={ref} triggerOnBlur={onBlur} options={[{value:'designer',label:'Designer'}]}/>);
 act(()=>ref.current?.focus());
 expect(screen.getByRole('combobox')).toHaveFocus();
 fireEvent.blur(screen.getByRole('combobox'));
 expect(onBlur).toHaveBeenCalledTimes(1);
});
test('RadioGroup focusRef targets the first enabled radio',()=>{
 const ref=React.createRef<HTMLButtonElement>();
 render(<RadioGroup label="Plan" focusRef={ref} options={[{value:'old',label:'Old',disabled:true},{value:'new',label:'New'}]}/>);
 act(()=>ref.current?.focus());
 expect(screen.getByRole('radio',{name:'New'})).toHaveFocus();
});
test('NativeSelect accepts the native form ref',()=>{
 const ref=React.createRef<HTMLSelectElement>();
 render(<NativeSelect aria-label="Native role" ref={ref} options={[{value:'designer',label:'Designer'}]}/>);
 act(()=>ref.current?.focus());
 expect(screen.getByRole('combobox')).toHaveFocus();
});

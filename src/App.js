import React, { useRef } from 'react';
import { useSprings, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import clamp from 'lodash-es/clamp'
import move from 'lodash-move'
import './App.scss';

const items = ['One', 'Two', 'Three', 'Four']

const fn = (order, originalIndex, y, curIndex, down) => index => (
   down && index === originalIndex
   ? {y: curIndex * 100 + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: n => n === 'y' || n === 'zIndex'}
   : {y: order.indexOf(index) * 100,  scale: 1, zIndex: '0', shadow: 1, immediate: false }
)

function App() {
  const order = useRef(items.map((_, index) => index))
  const [ props, set ] = useSprings(items.length, fn(order.current))
  const bind = useDrag(({ args: [originalIndex], down, movement: [, y]}) => {
       const curIndex = order.current.indexOf(originalIndex)
       const curRow = clamp(Math.round((curIndex * 100 + y)/100), 0, items.length - 1)
       const newOrder = move(order.current, curIndex, curRow)
       set(fn(newOrder,originalIndex, y, curIndex, down))
       if(!down)order.current = newOrder      
  })
  return (
    <div className="App">
      <div className='content' style={{height: items.length * 100}}>
        {props.map(({y, scale, zIndex, shadow}, i) => (
            <animated.div 
               {...bind(i)}
               key={i} 
               style={{
                  scale, 
                  zIndex, 
                  transform: y.interpolate(y => `translateY(${y}px)`),
                  boxShadow: shadow.interpolate(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                }}
            >{items[i]}</animated.div>
        ))}
      </div>
    </div>
  );
}

export default App;

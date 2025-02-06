import React from 'react'
import style from './style.module.css'

export default function GlowEffect({x, y}) {
  return (
    <div
       id={style.glow}
       style={{
       position: 'absolute',
       left: x,
       top: y,
       transform: 'translate(-50%, -50%)',
       pointerEvents: 'none', // Ensures the glow doesn't block mouse events
       zIndex: 10,           // Adjust if necessary
       }}
      >
      </div>
  )
}

import React, { useRef } from "react"
import { useGesture } from "@use-gesture/react"
import { animated, useSpring } from "react-spring"

const GestureComponent = () => {
  const ref = useRef(null)
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

  const handlers = useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        api.start({ x: dx, y: dy })
      },
    },
    {
      target: ref,
      eventOptions: { passive: false },
    }
  )

  return (
    <animated.div
      {...handlers}
      ref={ref}
      style={{
        x,
        y,
        width: 100,
        height: 100,
        backgroundColor: "lightblue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        touchAction: "none",
      }}
    >
      Drag me!
    </animated.div>
  )
}

export default GestureComponent

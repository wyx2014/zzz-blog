"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string
  maxOpacity?: number
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color,
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInViewRef = useRef(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [resolvedColor, setResolvedColor] = useState<string>("rgb(0, 0, 0)")

  const resolveColor = useCallback((colorValue: string | undefined): string => {
    if (typeof window === "undefined") {
      return "rgb(0, 0, 0)"
    }

    const colorToResolve = colorValue || "var(--foreground)"

    if (colorToResolve.startsWith("var(")) {
      const tempEl = document.createElement("div")
      tempEl.style.color = colorToResolve
      tempEl.style.position = "absolute"
      tempEl.style.visibility = "hidden"
      document.body.appendChild(tempEl)
      const computedColor = window.getComputedStyle(tempEl).color
      document.body.removeChild(tempEl)
      return computedColor || "rgb(0, 0, 0)"
    }

    return colorToResolve
  }, [])

  useEffect(() => {
    const updateColor = () => {
      const resolved = resolveColor(color)
      setResolvedColor(resolved)
    }

    updateColor()

    const observer = new MutationObserver(() => {
      updateColor()
    })

    if (typeof window !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [color, resolveColor])

  const memoizedColor = useMemo(() => {
    const toRGBA = (colorValue: string) => {
      if (typeof window === "undefined") {
        return `rgba(0, 0, 0,`
      }
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext("2d")
      if (!ctx) return "rgba(255, 0, 0,"
      ctx.fillStyle = colorValue
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
      return `rgba(${r}, ${g}, ${b},`
    }
    return toRGBA(resolvedColor)
  }, [resolvedColor])

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const cols = Math.floor(width / (squareSize + gridGap))
      const rows = Math.floor(height / (squareSize + gridGap))

      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }

      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity]
  )

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity
        }
      }
    },
    [flickerChance, maxOpacity]
  )

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number
    ) => {
      ctx.clearRect(0, 0, width, height)

      if (maxOpacity <= 0) return

      const numBuckets = 10
      const paths: Array<Path2D | undefined> = new Array(numBuckets + 1)

      const size = squareSize * dpr
      const step = (squareSize + gridGap) * dpr

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = squares[i * rows + j]
          if (opacity <= 0) continue

          const bucketIndex = Math.min(
            numBuckets,
            Math.max(1, Math.round((opacity / maxOpacity) * numBuckets))
          )

          const path = paths[bucketIndex] ?? new Path2D()
          path.rect(i * step, j * step, size, size)
          paths[bucketIndex] = path
        }
      }

      for (let b = 1; b <= numBuckets; b++) {
        const path = paths[b]
        if (!path) continue

        const opacity = (b / numBuckets) * maxOpacity
        ctx.fillStyle = `${memoizedColor}${opacity.toFixed(2)})`
        ctx.fill(path)
      }
    },
    [memoizedColor, squareSize, gridGap, maxOpacity]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number | null = null
    let gridParams: ReturnType<typeof setupCanvas>

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth
      const newHeight = height || container.clientHeight
      setCanvasSize({ width: newWidth, height: newHeight })
      gridParams = setupCanvas(canvas, newWidth, newHeight)
    }

    updateCanvasSize()

    let lastTime = 0
    let timeSinceLastFrame = 0
    const targetFps = 30
    const frameInterval = 1000 / targetFps
    const stopAnimation = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
      lastTime = 0
      timeSinceLastFrame = 0
    }

    const animate = (time: number) => {
      if (!isInViewRef.current) {
        stopAnimation()
        return
      }

      if (!lastTime) {
        lastTime = time
      }

      const deltaTime = time - lastTime
      timeSinceLastFrame += deltaTime
      lastTime = time

      if (timeSinceLastFrame >= frameInterval) {
        const deltaSec = timeSinceLastFrame / 1000
        updateSquares(gridParams.squares, deltaSec)
        drawGrid(
          ctx,
          canvas.width,
          canvas.height,
          gridParams.cols,
          gridParams.rows,
          gridParams.squares,
          gridParams.dpr
        )
        timeSinceLastFrame = timeSinceLastFrame % frameInterval
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (animationFrameId !== null) return

      timeSinceLastFrame = frameInterval
      animationFrameId = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })

    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          startAnimation()
        } else {
          stopAnimation()
        }
      },
      { threshold: 0 }
    )

    intersectionObserver.observe(canvas)

    if (isInViewRef.current) {
      startAnimation()
    }

    return () => {
      stopAnimation()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [setupCanvas, updateSquares, drawGrid, width, height])

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  )
}

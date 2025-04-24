"use client"

import type React from "react"

/**
 * This file provides alternative implementations for experimental React hooks
 * that might cause deployment issues.
 */

import { useCallback, useRef, useEffect } from "react"

/**
 * A stable callback that doesn't change on re-renders but can access the latest props/state
 * This is a safe alternative to the experimental useEffectEvent
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // @ts-ignore - the types are complex here
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args)
  }, []) as T
}

/**
 * A hook that combines useEffect and useCallback to avoid dependency arrays
 * This is a safe alternative to the experimental useEffectEvent pattern
 */
export function useEffectWithCallback(
  effect: () => void | (() => void),
  dependencies: React.DependencyList,
  callback: (...args: any[]) => any,
) {
  const stableCallback = useStableCallback(callback)

  useEffect(() => {
    return effect()
  }, [...dependencies, stableCallback])

  return stableCallback
}

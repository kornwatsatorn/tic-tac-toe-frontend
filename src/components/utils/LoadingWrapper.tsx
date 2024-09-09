"use client"

import { useLoading } from "@/context/LoadingContext"
import classNames from "classnames"

const LoadingWrapper = () => {
  const { isLoading } = useLoading()
  if (!isLoading) return null

  return (
    <section
      className={classNames(
        "position-fixed",
        "w-100",
        "h-100",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "bg-black",
        "opacity-50"
      )}
      style={{ zIndex: 2200 }}
    >
      <p className={classNames("text-primary")}>Loading</p>
    </section>
  )
}
export default LoadingWrapper

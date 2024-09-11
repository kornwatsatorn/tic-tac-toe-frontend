import { useEffect, useRef, useState } from "react"
import { defaultImage } from "@/utils/default"
import Image from "next/image"
import { Placeholder } from "react-bootstrap"
import classNames from "classnames"

interface IProps {
  src: string | undefined | null
  alt?: string
  width?: string
  height?: string
  objectFit?: "contain" | "cover"
  className?: string | undefined
  direction?: "center" | "start" | "end"
  id?: string
  notPlaceholder?: boolean
}

const ImageWrapper = ({
  src,
  alt,
  width = "100%",
  height = "100%",
  objectFit = "cover",
  className,
  direction = "start",
  id,
  notPlaceholder = false,
}: IProps) => {
  const [loading, setLoading] = useState(true)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const handleError = () => {
    if (imageRef.current) {
      if (imageRef.current.src !== window.location.origin + defaultImage) {
        imageRef.current.src = defaultImage
        imageRef.current.srcset = defaultImage
        setLoading(false)
      }
    }
  }

  const [classPosition, setClassPosition] = useState<
    "ms-auto" | "me-auto" | "mx-auto"
  >("ms-auto")

  useEffect(() => {
    if (direction) {
      if (direction === "start") setClassPosition("me-auto")
      else if (direction === "end") setClassPosition("ms-auto")
      else if (direction === "center") setClassPosition("mx-auto")
    }
  }, [direction])

  return (
    <div
      style={{ position: "relative", width: width, height: height }}
      className={classNames(classPosition)}
    >
      {loading && notPlaceholder && (
        <Placeholder
          as="div"
          animation="glow"
          bg="primary"
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Placeholder xs={12} style={{ height: "100%" }} />
        </Placeholder>
      )}
      {src && (
        <Image
          key={`${src}?${new Date().getTime()}`}
          src={src}
          alt={alt ?? "image"}
          layout="fill"
          onLoadingComplete={() => setLoading(false)}
          style={{ objectFit }}
          ref={imageRef}
          onError={handleError}
          priority
          className={className}
          id={id}
        />
      )}
    </div>
  )
}

export default ImageWrapper

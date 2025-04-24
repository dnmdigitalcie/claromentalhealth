import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "small" | "medium" | "large"
}

export function Logo({ size = "medium" }: LogoProps) {
  const sizes = {
    small: { width: 80, height: 24 },
    medium: { width: 120, height: 36 },
    large: { width: 160, height: 48 },
  }

  const { width, height } = sizes[size]

  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image src="/images/claro-logo-dark-blue.png" alt="Claro" width={width} height={height} priority />
    </Link>
  )
}

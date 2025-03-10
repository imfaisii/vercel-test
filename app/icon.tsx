import { ImageResponse } from "next/og"

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

// Image generation
export default function Icon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        background: "#3b82f6", // Primary blue color
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px",
      }}
    >
      {/* Simple calculator icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" x2="16" y1="6" y2="6" />
        <line x1="8" x2="8" y1="12" y2="12" />
        <line x1="12" x2="12" y1="12" y2="12" />
        <line x1="16" x2="16" y1="12" y2="12" />
        <line x1="8" x2="8" y1="16" y2="16" />
        <line x1="12" x2="12" y1="16" y2="16" />
        <line x1="16" x2="16" y1="16" y2="16" />
      </svg>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}


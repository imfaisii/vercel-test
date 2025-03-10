import { ImageResponse } from "next/og"

// Image metadata
export const size = {
  width: 180,
  height: 180,
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
        borderRadius: "36px",
        padding: "20px",
      }}
    >
      {/* Calculator icon with display */}
      <svg
        width="140"
        height="140"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Calculator body */}
        <rect x="4" y="2" width="16" height="20" rx="2" />

        {/* Calculator display */}
        <rect x="6" y="4" width="12" height="4" fill="white" opacity="0.9" rx="1" />

        {/* Calculator buttons */}
        <circle cx="8" cy="12" r="1.5" fill="white" opacity="0.9" />
        <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.9" />
        <circle cx="16" cy="12" r="1.5" fill="white" opacity="0.9" />

        <circle cx="8" cy="16" r="1.5" fill="white" opacity="0.9" />
        <circle cx="12" cy="16" r="1.5" fill="white" opacity="0.9" />
        <circle cx="16" cy="16" r="1.5" fill="white" opacity="0.9" />
      </svg>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}


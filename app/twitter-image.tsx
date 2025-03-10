import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Free Calculators - 100+ Tools for Math, Finance & More"
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" style={{ marginRight: 20 }}>
          <rect x="4" y="3" width="16" height="18" rx="2" fill="#3b82f6" />
          <path
            d="M8 7H16M8 11H16M8 15H12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "#1e293b",
          }}
        >
          Free Calculators
        </div>
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#64748b",
          marginTop: 10,
        }}
      >
        100+ Tools for Math, Finance & More
      </div>
    </div>,
    {
      ...size,
    },
  )
}


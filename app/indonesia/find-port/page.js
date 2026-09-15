"use client";

import { useState } from "react";
import Link from "next/link";
import { COLORS } from "@/lib/theme";

export default function FindPortPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function handleFind() {
    if (!address.trim()) {
      setError("Enter your accommodation address or hotel name first.");
      return;
    }
    setError("");
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/closest-port", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong looking that up.");
      } else {
        setData(json);
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px 60px" }}>
      <h1 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, fontSize: 30, color: COLORS.sea, marginBottom: 6 }}>
        Find My Closest Port
      </h1>
      <p style={{ fontSize: 13.5, opacity: 0.65, marginBottom: 24, maxWidth: 560 }}>
        Enter where you&apos;re staying in Bali and we&apos;ll work out real driving times to every port, using live
        Google Maps directions — not an area-based estimate.
      </p>

      <label className="block" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: COLORS.sea, letterSpacing: 1, marginBottom: 12 }}>
        YOUR ACCOMMODATION ADDRESS OR HOTEL NAME
        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFind()}
            placeholder="e.g. Jl. Pantai Berawa No.5, Canggu"
            className="sm:flex-1"
            style={{ padding: "10px 10px", borderRadius: 6, border: `1px solid ${COLORS.foamLine}`, fontFamily: "'Inter', sans-serif", fontSize: 14 }}
          />
          <button
            type="button"
            onClick={handleFind}
            disabled={loading}
            style={{
              background: COLORS.coral,
              color: "white",
              fontWeight: 700,
              fontSize: 14,
              padding: "11px 22px",
              borderRadius: 6,
              border: "none",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "Finding…" : "Find closest port"}
          </button>
        </div>
      </label>

      {error && (
        <div style={{ background: "#FDEDEA", border: `1px solid ${COLORS.coralDeep}`, color: COLORS.coralDeep, borderRadius: 8, padding: 12, fontSize: 13, marginTop: 12 }}>
          {error}
        </div>
      )}

      {data && (
        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 12, opacity: 0.55, marginBottom: 14 }}>
            Driving times from <strong>{data.resolvedAddress}</strong>:
          </p>
          <div className="flex flex-col gap-2">
            {data.results.map((r, i) => (
              <div
                key={r.port}
                style={{ background: "white", border: `1px solid ${COLORS.foamLine}`, borderRadius: 10, padding: 14, position: "relative" }}
              >
                {i === 0 && r.status === "OK" && (
                  <div style={{ position: "absolute", top: -10, left: 14, background: COLORS.coral, color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, letterSpacing: 0.5 }}>
                    CLOSEST
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{r.port}</div>
                    <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>Connects to: {r.connects}</div>
                  </div>
                  {r.status === "OK" ? (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 700, fontSize: 18, color: COLORS.sea }}>
                        {r.durationText}
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, opacity: 0.7 }}>{r.distanceText}</div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: COLORS.coralDeep }}>No driving route found</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, opacity: 0.5, marginTop: 12 }}>
            Times are Google&apos;s current driving estimate, not accounting for Bali traffic patterns at your actual
            travel time — leave buffer during peak hours (7–9am, 4–7pm) in South Bali.
          </p>
          <Link
            href="/indonesia/planner"
            style={{ display: "inline-block", marginTop: 16, background: COLORS.sea, color: "white", fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 6, textDecoration: "none" }}
          >
            See boat options from your closest port →
          </Link>
        </div>
      )}
    </div>
  );
}

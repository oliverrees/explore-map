"use client";

import { useParams } from "next/navigation";

export default function MapPage() {
  const params = useParams();
  const mapId = params.mapId;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Map ID: {mapId}</h1>
      {mapId ? <p>The map ID is {mapId}.</p> : <p>Loading...</p>}
    </div>
  );
}

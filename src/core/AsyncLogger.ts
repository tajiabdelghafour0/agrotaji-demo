"use server";

export async function logInteraction(data: {
  event: string;
  metadata: any;
  timestamp: string;
}) {
  // We use non-blocking promise resolution to simulate fire-and-forget logging
  Promise.resolve().then(() => {
    console.log("[AsyncLogger] Recorded for Heatmap DB:", data);
  }).catch(console.error);
}

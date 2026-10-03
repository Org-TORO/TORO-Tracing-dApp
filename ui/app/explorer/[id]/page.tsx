import TraceDetailClient from "./TraceDetailClient";
import traceIndex from "@/src/data/traceIndex.json";

export function generateStaticParams() {
  return Object.keys(traceIndex.lots).map((id) => ({ id }));
}

// Unknown codes (e.g. counterfeit scans) must render on demand so the
// client can show the unverified-product warning — never 404.
export const dynamicParams = true;

export default function TraceDetailPage() {
  return <TraceDetailClient />;
}

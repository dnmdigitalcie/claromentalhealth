import EnvCheck from "@/components/diagnostics/env-check"

export default function DiagnosticsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">System Diagnostics</h1>
      <div className="grid gap-6">
        <EnvCheck />
      </div>
    </div>
  )
}

// Global loading skeleton — shows instantly while any page JS is fetching
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070913]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
          <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <div className="text-xs font-mono text-slate-500 tracking-widest uppercase">Loading</div>
      </div>
    </div>
  )
}

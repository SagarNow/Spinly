'use client'

import React, { Suspense, lazy } from 'react'

const SpinWheel = lazy(() => import('@/Components/SpinWheel'))

function WheelSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
        <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
    </div>
  )
}

export default function SpinPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-12 relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/12 via-purple-600/12 to-pink-500/8 blur-[120px] pointer-events-none -z-10" />

      {/* Wheel Studio — lazy loaded */}
      <Suspense fallback={<WheelSkeleton />}>
        <SpinWheel />
      </Suspense>
    </div>
  )
}

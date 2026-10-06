'use client'

import React from 'react'
import { motion } from 'framer-motion'
import SpinWheel from '@/Components/SpinWheel'

export default function SpinPage() {
  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-12 relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/12 via-purple-600/12 to-pink-500/8 blur-[120px] pointer-events-none -z-10" />

      {/* Wheel Studio */}
      <SpinWheel />
    </div>
  )
}

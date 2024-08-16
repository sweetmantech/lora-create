'use client'

import CreateButton from '../CreateButton'
import Points from '../Points'
import MainMediaUpload from './MainMediaUpload'
import SaleStrategySelect from './SaleStrategySelect'
import Title from './Title'
import Animation from './Animation'
import { base, baseSepolia } from 'viem/chains'

const LandingPage = () => (
  <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
    <div className="gap-5 mx-auto max-w-md text-center items-center flex flex-col gap-5">
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Zora Create
      </h1>
      <MainMediaUpload />
      <Title />
      <SaleStrategySelect />
      <Animation />
      <div className="mt-11 flex justify-between w-full">
        <CreateButton chainId={baseSepolia.id}>Preview</CreateButton>
        <CreateButton chainId={base.id}>Publish</CreateButton>
      </div>
      <Points />
    </div>
  </div>
)

export default LandingPage

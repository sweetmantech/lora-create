'use client'

import { useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { useWriteContracts } from 'wagmi/experimental'
import { CHAIN_ID, PROFILE_APP_URL } from '@/lib/consts'
import { usePaymasterProvider } from '@/providers/PaymasterProvider'
import useCreateSuccess from '@/hooks/useCreateSuccess'
import useCreateMetadata from '@/hooks/useCreateMetadata'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'
import { Address } from 'viem'
import useZoraCreateParameters from './useZoraCreateParameters'

export default function useZoraCreate() {
  const { push } = useRouter()
  const { address } = useAccount()
  const { getCapabilities } = usePaymasterProvider()
  const { data: callsStatusId, writeContractsAsync } = useWriteContracts()
  const createMetadata = useCreateMetadata()
  const { switchChainAsync } = useSwitchChain()
  const [creating, setCreating] = useState<boolean>(false)
  const params = useParams()
  const chainId = Number(params.chainId) || CHAIN_ID
  const collection = params.collection as Address | undefined
  const { parameters } = useZoraCreateParameters(chainId, collection)

  useCreateSuccess(callsStatusId, () => push(`${PROFILE_APP_URL}/${address}`), !!params.collection)

  const create = async () => {
    setCreating(true)
    try {
      if (!address) {
        throw new Error('No wallet connected')
      }
      await switchChainAsync({ chainId })

      if (!parameters) {
        throw new Error('Parameters not ready')
      }

      await writeContractsAsync({
        contracts: [{ ...parameters }],
        capabilities: getCapabilities(chainId),
      } as any)
    } catch (err) {
      setCreating(false)
      toast.error("Couldn't create contract")
      console.log(err.message)
    }
  }

  return { create, creating, ...createMetadata }
}

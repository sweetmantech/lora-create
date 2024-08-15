import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { parseEventLogs } from 'viem'
import { useCallsStatus } from 'wagmi/experimental'
import { zoraCreator1155FactoryImplABI } from '@zoralabs/protocol-deployments'
import trackSetupNewContractPoints from '@/lib/stack/trackSetupNewContractPoints'
import { useAccount } from 'wagmi'
import { usePointsProvider } from '@/providers/PointsProvider'

const useCreateSuccessRedirect = (callsStatusId?: string) => {
  const { address } = useAccount()
  const { data: callsStatus } = useCallsStatus({
    id: callsStatusId as string,
    query: {
      enabled: !!callsStatusId,
      refetchInterval: (data) => (data.state.data?.status === 'CONFIRMED' ? false : 500),
    },
  })
  const { refetch } = usePointsProvider()

  useEffect(() => {
    const handleSuccess = async () => {
      const logs = parseEventLogs({
        abi: zoraCreator1155FactoryImplABI,
        logs: callsStatus.receipts?.[0]?.logs as any[],
      }) as any
      const { args } = logs?.[1] as any
      toast.success('Project Created Successfully!')
      await trackSetupNewContractPoints(address, args)
      await refetch()
    }

    if (callsStatus?.status !== 'CONFIRMED') return
    handleSuccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callsStatus])
}

export default useCreateSuccessRedirect
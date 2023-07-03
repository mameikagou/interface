import { QueryHookOptions } from '@apollo/client'
import { TradeType } from '@uniswap/sdk-core'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { ChainId } from 'wallet/src/constants/chains'
import { DEFAULT_SLIPPAGE_TOLERANCE } from 'wallet/src/constants/transactions'
import { useRestQuery } from 'wallet/src/data/rest'
import { logger } from 'wallet/src/features/logger/logger'
import { transformQuoteToTrade } from 'wallet/src/features/transactions/swap/routeUtils'
import { PermitSignatureInfo } from 'wallet/src/features/transactions/swap/usePermit2Signature'
import { serializeQueryParams } from 'wallet/src/features/transactions/swap/utils'
import { SwapRouterNativeAssets } from 'wallet/src/utils/currencyId'
import serializeError from 'wallet/src/utils/serializeError'
import { ONE_MINUTE_MS } from 'wallet/src/utils/time'
import { QuoteResult, TradeQuoteResult } from './types'

const DEFAULT_DEADLINE_S = 60 * 30 // 30 minutes in seconds

const protocols: string[] = ['v2', 'v3', 'mixed']

const DEFAULT_QUERY_PARAMS = {
  protocols: protocols.map((p) => p.toLowerCase()).join(','),
  // example other params
  // forceCrossProtocol: 'true',
  // minSplits: '5',
}

// error string hardcoded in @uniswap/routing-api
export const SWAP_NO_ROUTE_ERROR = 'NO_ROUTE'
// error string hardcoded in @uniswap/api
// https://github.com/Uniswap/api/blob/main/bin/stacks/api-v1.ts#L234
export const API_RATE_LIMIT_ERROR = 'TOO_MANY_REQUESTS'

interface TradeQuoteRequest {
  amount: string
  deadline?: number
  enableUniversalRouter: boolean
  fetchSimulatedGasLimit?: boolean
  recipient?: string
  slippageTolerance?: number
  tokenInAddress: string
  tokenInChainId: ChainId
  tokenOutAddress: string
  tokenOutChainId: ChainId
  type: 'exactIn' | 'exactOut'
  permitSignatureInfo?: PermitSignatureInfo | null
  loggingProperties: {
    isUSDQuote?: boolean
  }
}

export function useQuoteQuery(
  request: TradeQuoteRequest | undefined,
  { pollInterval }: QueryHookOptions
): ReturnType<typeof useRestQuery<TradeQuoteResult>> {
  let serializedParams = ''
  if (request) {
    const {
      amount,
      deadline = DEFAULT_DEADLINE_S,
      enableUniversalRouter,
      fetchSimulatedGasLimit,
      recipient,
      permitSignatureInfo,
      slippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE,
      tokenInAddress,
      tokenInChainId,
      tokenOutAddress,
      tokenOutChainId,
      type,
    } = request

    const recipientParams = recipient
      ? {
          recipient,
          slippageTolerance,
          deadline,
        }
      : undefined

    const simulatedParams =
      recipient && fetchSimulatedGasLimit ? { simulateFromAddress: recipient } : undefined

    // permit2 signature data if applicable
    const permit2Params = permitSignatureInfo
      ? {
          permitSignature: permitSignatureInfo.signature,
          permitAmount: BigNumber.from(permitSignatureInfo.permitMessage.details.amount).toString(),
          permitExpiration: BigNumber.from(
            permitSignatureInfo.permitMessage.details.expiration
          ).toString(),
          permitSigDeadline: BigNumber.from(
            permitSignatureInfo.permitMessage.sigDeadline
          ).toString(),
          permitNonce: BigNumber.from(permitSignatureInfo.permitMessage.details.nonce).toString(),
        }
      : undefined

    serializedParams = serializeQueryParams({
      ...DEFAULT_QUERY_PARAMS,
      amount,
      enableUniversalRouter,
      tokenInAddress,
      tokenInChainId,
      tokenOutAddress,
      tokenOutChainId,
      type,
      ...recipientParams,
      ...simulatedParams,
      ...permit2Params,
    })
  }

  const result = useRestQuery<QuoteResult, { params: string }>(
    `/v1/quote?${serializedParams}`,
    // the params need to be passed as variables even though they're not being used in the query because they are used as the cache key
    { params: serializedParams },
    [
      'quoteId',
      'blockNumber',
      'amount',
      'amountDecimals',
      'gasPriceWei',
      'gasUseEstimate',
      'gasUseEstimateQuote',
      'gasUseEstimateQuoteDecimals',
      'gasUseEstimateUSD',
      'methodParameters',
      'quote',
      'quoteDecimals',
      'quoteGasAdjusted',
      'quoteGasAdjustedDecimals',
      'route',
      'routeString',
      'simulationError',
      'timestamp',
    ],
    {
      pollInterval,
      skip: !request,
      notifyOnNetworkStatusChange: true,
    },
    'GET'
  )

  return useMemo(() => {
    if (result.error && request?.loggingProperties?.isUSDQuote) {
      logger.error('Error in Routing API response', {
        tags: {
          file: 'routingApi',
          function: 'quote',
          error: serializeError(result.error.message),
        },
      })
    }

    if (result.data) {
      // Since there is no cachettl if the cached query being returned is more than a minute old then refetch
      if (result.data?.timestamp && Date.now() - result.data.timestamp > ONE_MINUTE_MS) {
        result.refetch?.()
        return { ...result, data: undefined }
      }

      const tradeType = request?.type === 'exactIn' ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT
      const tokenInIsNative = Object.values(SwapRouterNativeAssets).includes(
        request?.tokenInAddress as SwapRouterNativeAssets
      )
      const tokenOutIsNative = Object.values(SwapRouterNativeAssets).includes(
        request?.tokenOutAddress as SwapRouterNativeAssets
      )
      const trade = transformQuoteToTrade(
        tokenInIsNative,
        tokenOutIsNative,
        tradeType,
        request?.deadline,
        request?.slippageTolerance,
        result.data
      )

      return {
        ...result,
        data: {
          trade,
          simulationError: result.data.simulationError,
          gasUseEstimate: result.data.gasUseEstimate,
          timestamp: Date.now(),
        },
      }
    }

    return {
      ...result,
      data: undefined,
    }
  }, [
    result,
    request?.deadline,
    request?.loggingProperties?.isUSDQuote,
    request?.slippageTolerance,
    request?.tokenInAddress,
    request?.tokenOutAddress,
    request?.type,
  ])
}
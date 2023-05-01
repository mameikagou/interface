import { Text } from 'ui/src'

import { Flex } from 'ui/src/components/layout/Flex'
import { PortfolioBalance } from 'wallet/src/features/home/PortfolioBalance'
import { PortfolioHeader } from 'wallet/src/features/home/PortfolioHeader'
import { TokenBalanceList } from 'wallet/src/features/home/TokenBalanceList'
import { useActiveAccountAddressWithThrow } from 'wallet/src/features/wallet/hooks'

export function HomeScreen(): JSX.Element {
  const address = useActiveAccountAddressWithThrow()
  return (
    <Flex alignItems="center" flexGrow={1} width="100%">
      {address ? (
        <Flex
          backgroundColor="$background1"
          flexGrow={1}
          gap="$spacing8"
          paddingBottom="$spacing24"
          paddingTop="$spacing8"
          width="100%">
          <PortfolioHeader address={address} />
          <PortfolioBalance address={address} />
          <TokenBalanceList owner={address} />
        </Flex>
      ) : (
        <Text color="$accentCritical" variant="subheadLarge">
          Error loading accounts
        </Text>
      )}
    </Flex>
  )
}

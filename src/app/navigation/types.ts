import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
  useNavigation,
} from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { PreloadedQuery } from 'react-relay'
import { EducationContentType } from 'src/components/education'
import { TransactionListQuery } from 'src/components/TransactionList/__generated__/TransactionListQuery.graphql'
import { NFTAsset } from 'src/features/nfts/types'
import { ImportType, OnboardingEntryPoint } from 'src/features/onboarding/utils'
import { OnboardingScreens, Screens, Tabs } from 'src/screens/Screens'
import { TokenDetailsScreenQuery } from 'src/screens/__generated__/TokenDetailsScreenQuery.graphql'

type NFTItem = { owner: Address } & Pick<NFTAsset.AssetContract, 'address'> &
  Pick<NFTAsset.Asset, 'token_id'> & { floorPrice?: number }

export type TabParamList = {
  [Tabs.Home]: undefined
  [Tabs.Explore]: undefined | { screen: Screens; params: { address: string } }
  [Tabs.SwapButton]: undefined
}

export type HomeStackParamList = {
  [Screens.Home]: undefined
}

export type ExploreStackParamList = {
  [Screens.Explore]: undefined
}

export type AccountStackParamList = {
  [Screens.Accounts]: undefined
}

export type SettingsStackParamList = {
  [Screens.Settings]: undefined
  [Screens.SettingsWallet]: { address: Address }
  [Screens.SettingsWalletEdit]: { address: Address }
  [Screens.SettingsWalletManageConnection]: { address: Address }
  [Screens.SettingsHelpCenter]: undefined
  [Screens.SettingsChains]: undefined
  [Screens.SettingsSupport]: undefined
  [Screens.SettingsTestConfigs]: undefined
  [Screens.SettingsFaceId]: undefined
  [Screens.WebView]: { headerTitle: string; uriLink: string }
  [Screens.Dev]: undefined
  [Screens.SettingsCloudBackupScreen]: { address: Address }
  [Screens.SettingsCloudBackupStatus]: { address: Address }
  [Screens.SettingsViewSeedPhrase]: { address: Address }
  [OnboardingScreens.Landing]: undefined // temporary to be able to view onboarding from settings
}

export type OnboardingStackBaseParams =
  | {
      importType?: ImportType
      entryPoint?: OnboardingEntryPoint
    }
  | undefined

export type OnboardingStackParamList = {
  [OnboardingScreens.BackupCloudProcessing]: {
    password: string
  } & OnboardingStackBaseParams
  [OnboardingScreens.BackupManual]: OnboardingStackBaseParams
  [OnboardingScreens.BackupCloudPassword]: OnboardingStackBaseParams
  [OnboardingScreens.Backup]: OnboardingStackBaseParams
  [OnboardingScreens.Landing]: OnboardingStackBaseParams
  [OnboardingScreens.EditName]: OnboardingStackBaseParams
  [OnboardingScreens.SelectColor]: OnboardingStackBaseParams
  [OnboardingScreens.Notifications]: OnboardingStackBaseParams
  [OnboardingScreens.Outro]: OnboardingStackBaseParams
  [OnboardingScreens.Security]: OnboardingStackBaseParams

  // import
  [OnboardingScreens.ImportMethod]: OnboardingStackBaseParams
  [OnboardingScreens.RestoreCloudBackup]: OnboardingStackBaseParams
  [OnboardingScreens.RestoreCloudBackupPassword]: {
    mnemonicId: string
  } & OnboardingStackBaseParams
  [OnboardingScreens.SeedPhraseInput]: OnboardingStackBaseParams
  [OnboardingScreens.SelectWallet]: OnboardingStackBaseParams
  [OnboardingScreens.WatchWallet]: OnboardingStackBaseParams

  [Screens.Home]: undefined
}

export type AppStackParamList = {
  [Screens.AccountStack]: NavigatorScreenParams<AccountStackParamList>
  [Screens.Education]: {
    type: EducationContentType
  }
  [Screens.SettingsWalletManageConnection]: { address: Address }
  [Screens.Notifications]: undefined | { txHash: string }
  [Screens.OnboardingStack]: NavigatorScreenParams<OnboardingStackParamList>
  [Screens.SettingsStack]: NavigatorScreenParams<SettingsStackParamList>
  [Screens.TabNavigator]: NavigatorScreenParams<TabParamList>
  [Screens.TokenDetails]: {
    currencyId: string
    preloadedQuery: NullUndefined<PreloadedQuery<TokenDetailsScreenQuery>>
  }
  [Screens.NFTItem]: NFTItem
  [Screens.ExternalProfile]: {
    address: string
    preloadedQuery: NullUndefined<PreloadedQuery<TransactionListQuery>>
  }
  [Screens.Activity]: {
    preloadedQuery: NullUndefined<PreloadedQuery<TransactionListQuery>>
  }
  [Screens.WebView]: { headerTitle: string; uriLink: string }
}

export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>
export type AppStackScreenProps = NativeStackScreenProps<AppStackParamList>
export type AppStackScreenProp<Screen extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  Screen
>

export type TabNavigationProp<Screen extends keyof TabParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, Screen>,
  AppStackNavigationProp
>
export type TabScreenProp<Screen extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, Screen>,
  AppStackScreenProps
>

export type AccountStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AccountStackParamList>,
  AppStackNavigationProp
>

export type AccountStackScreenProp<Screen extends keyof AccountStackParamList> =
  CompositeScreenProps<NativeStackScreenProps<AccountStackParamList, Screen>, AppStackScreenProps>

export type HomeStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  AppStackNavigationProp
>

export type HomeStackScreenProp<Screen extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, Screen>,
  AppStackScreenProps
>

export type ExploreStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ExploreStackParamList>,
  AppStackNavigationProp
>

export type ExploreStackScreenProp<Screen extends keyof ExploreStackParamList> =
  CompositeScreenProps<NativeStackScreenProps<ExploreStackParamList, Screen>, AppStackScreenProps>

export type SettingsStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<SettingsStackParamList>,
  AppStackNavigationProp
>

export type SettingsStackScreenProp<Screen extends keyof SettingsStackParamList> =
  CompositeScreenProps<NativeStackScreenProps<SettingsStackParamList, Screen>, AppStackScreenProps>

export type OnboardingStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<OnboardingStackParamList>,
  AppStackNavigationProp
>

export type RootParamList = TabParamList &
  HomeStackParamList &
  AccountStackParamList &
  SettingsStackParamList &
  OnboardingStackParamList &
  AppStackParamList

export const useAppStackNavigation = () => useNavigation<AppStackNavigationProp>()
export const useHomeStackNavigation = () => useNavigation<HomeStackNavigationProp>()
export const useExploreStackNavigation = () => useNavigation<ExploreStackNavigationProp>()
export const useAccountStackNavigation = () => useNavigation<AccountStackNavigationProp>()
export const useSettingsStackNavigation = () => useNavigation<SettingsStackNavigationProp>()
export const useOnboardingStackNavigation = () => useNavigation<OnboardingStackNavigationProp>()

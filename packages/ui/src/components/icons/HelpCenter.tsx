import type { IconProps } from '@tamagui/helpers-icon'
import React, { memo } from 'react'
import { Path, Svg } from 'react-native-svg'
import { getTokenValue, isWeb, useTheme } from 'tamagui'

const Icon: React.FC<IconProps> = (props) => {
  // isWeb currentColor to maintain backwards compat a bit better, on native uses theme color
  const {
    color: colorProp = isWeb ? 'currentColor' : undefined,
    size: sizeProp = '$true',
    strokeWidth: strokeWidthProp,
    ...restProps
  } = props
  const theme = useTheme()

  const size = typeof sizeProp === 'string' ? getTokenValue(sizeProp, 'size') : sizeProp

  const strokeWidth =
    typeof strokeWidthProp === 'string' ? getTokenValue(strokeWidthProp, 'size') : strokeWidthProp

  const color = colorProp ?? theme.color.get()

  const svgProps = {
    ...restProps,
    size,
    strokeWidth,
    color,
  }

  return (
    <Svg fill={color} height={size} viewBox="0 0 18 19" width={size} {...svgProps}>
      <Path
        d="M15 0.117188H3C1 0.117188 0 1.11719 0 3.11719V18.1172L3 15.1172H15C17 15.1172 18 14.1172 18 12.1172V3.11719C18 1.11719 17 0.117188 15 0.117188ZM9.02002 12.1172C8.46802 12.1172 8.01489 11.6692 8.01489 11.1172C8.01489 10.5652 8.45801 10.1172 9.01001 10.1172H9.02002C9.57302 10.1172 10.02 10.5652 10.02 11.1172C10.02 11.6692 9.57202 12.1172 9.02002 12.1172ZM10.345 8.16821C9.78897 8.53821 9.71296 8.72515 9.70996 8.73315C9.59696 9.03515 9.30507 9.22925 8.99707 9.22925C8.91507 9.22925 8.83295 9.21516 8.75195 9.18616C8.36695 9.04916 8.15806 8.6402 8.28906 8.2522C8.49206 7.6522 9.08489 7.20419 9.51489 6.91919C10.1509 6.49619 10.1579 6.06723 10.1079 5.78223C10.0299 5.34123 9.65294 4.96323 9.21094 4.88623C8.87494 4.82523 8.53808 4.91213 8.27808 5.13013C8.02208 5.34513 7.87598 5.65919 7.87598 5.99219C7.87598 6.40619 7.53998 6.74219 7.12598 6.74219C6.71198 6.74219 6.37598 6.40619 6.37598 5.99219C6.37598 5.21419 6.71796 4.4812 7.31396 3.9812C7.90997 3.4812 8.69395 3.2712 9.47095 3.4082C10.5299 3.5942 11.399 4.46322 11.585 5.52222C11.769 6.57522 11.329 7.51421 10.345 8.16821Z"
        fill={color}
      />
    </Svg>
  )
}

Icon.displayName = 'HelpCenter'

export const HelpCenter = memo<IconProps>(Icon)
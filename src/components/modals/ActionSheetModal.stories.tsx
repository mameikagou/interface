import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Check from 'src/assets/icons/check.svg'
import { Box, Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { ActionSheetModalContent } from './ActionSheetModal'

const options = [
  {
    key: '1',
    onPress: () => {},
    render: () => (
      <Flex row flex={1} justifyContent="space-between" p="md">
        <Text variant="bodyLarge">Market Cap</Text>
        <Check height={18} width={18} />
      </Flex>
    ),
  },
  {
    key: '2',
    onPress: () => {},
    render: () => (
      <Box p="md">
        <Text variant="bodyLarge">Volume</Text>
      </Box>
    ),
  },
  {
    key: '3',
    onPress: () => {},
    render: () => (
      <Box p="md">
        <Text variant="bodyLarge">Percent Change</Text>
      </Box>
    ),
  },
]

export default {
  title: 'WIP/Modals/Action Sheet',
  component: ActionSheetModalContent,
  decorators: [
    (Story) => (
      <Box bg="background0" p="lg" width={300}>
        <Story />
      </Box>
    ),
  ],
} as ComponentMeta<typeof ActionSheetModalContent>

const Template: ComponentStory<typeof ActionSheetModalContent> = (args) => (
  <ActionSheetModalContent {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  header: 'Sort tokens by',
  options,
}

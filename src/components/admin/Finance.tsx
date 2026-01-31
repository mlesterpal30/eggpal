import { TabPanel, TabList, TabIndicator, TabPanels, Tabs, Tab } from '@chakra-ui/react'
import Sales from './Sales'
import Expenses from './Expenses'
import React from 'react'   

const Finance = () => {
  return (
    <Tabs position='relative' variant='unstyled'>
    <TabList>
        <Tab>Sales</Tab>
        <Tab>Expenses</Tab>
        <Tab>Three</Tab>
    </TabList>
    <TabIndicator mt='-1.5px' height='2px' bg='blue.500' borderRadius='1px' />
    <TabPanels>
        <TabPanel>
              <Sales/>
        </TabPanel>
        <TabPanel>
              <Expenses/>
        </TabPanel>
        <TabPanel>
        <p>three!</p>
        </TabPanel>
    </TabPanels>
</Tabs>
  )
}

export default Finance
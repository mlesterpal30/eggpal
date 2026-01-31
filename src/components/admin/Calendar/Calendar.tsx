import { useState, useEffect } from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import Home from './Home'
import CalendarAssistant from './CalendarAssistant'

const TAB_STORAGE_KEY = 'calendar-selected-tab'

const Calendar = () => {
  // Initialize tab index from localStorage or default to 0
  const [tabIndex, setTabIndex] = useState(() => {
    const savedTab = localStorage.getItem(TAB_STORAGE_KEY)
    return savedTab ? parseInt(savedTab, 10) : 0
  })

  // Save tab index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(TAB_STORAGE_KEY, tabIndex.toString())
  }, [tabIndex])

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  return (
    <>
    <Tabs fontFamily="geist" index={tabIndex} onChange={handleTabsChange}>
    <TabList>
      <Tab>Home</Tab>
      <Tab>Calendar Assistant</Tab>
    </TabList>
  
    <TabPanels>
      <TabPanel>
            <Home />
      </TabPanel>
      <TabPanel>
        <CalendarAssistant />
      </TabPanel>
    </TabPanels>
  </Tabs>
    </>
   )
}

export default Calendar
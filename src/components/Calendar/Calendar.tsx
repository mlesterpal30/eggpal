import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import Home from './Home'
import CalendarAssistant from './CalendarAssistant'

const Calendar = () => {
  return (
    <>
    <Tabs fontFamily="geist">
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
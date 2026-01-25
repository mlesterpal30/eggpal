import { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  HStack,
  VStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Temporal } from "temporal-polyfill";
import { useGetEvents } from "../../hooks/EventRepository";
import { Event } from "../../entiies/Event";

const CalendarAssistant = () => {
  const philippinesTimeZone = "Asia/Manila";
  const now = Temporal.Now.zonedDateTimeISO(philippinesTimeZone);
  const today = now.toPlainDate();

  // Initialize with current year, month, and week 1
  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);
  const [week, setWeek] = useState(1);
  
  // State to track when to fetch - only fetch when button is clicked
  const [searchDate, setSearchDate] = useState<string | null>(null);

  // Convert year, month, week to date format: DD/MM/YYYY 12:00:00
  // Week value is the starting day (1, 8, 15, 22)
  const fromDate = useMemo(() => {
    try {
      // Get the number of days in the selected month
      const firstDayOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
      const daysInMonth = firstDayOfMonth.daysInMonth;
      
      // Use the week value (starting day), but don't exceed the number of days in the month
      // For week 4 (day 22), if month has fewer days, use the last day of the month
      const dayToUse = Math.min(week, daysInMonth);
      
      // Create a date with the selected year, month, and calculated day
      const date = Temporal.PlainDate.from({ year, month, day: dayToUse });
      
      // Format as YYYY-MM-DD HH:mm:ss (standard format for backend)
      const day = date.day.toString().padStart(2, '0');
      const monthStr = date.month.toString().padStart(2, '0');
      const yearStr = date.year.toString();
      
      return `${yearStr}-${monthStr}-${day} 12:00:00`;
    } catch (error) {
      console.error("Error creating date:", error);
      return null;
    }
  }, [year, month, week]);

  // Check if all values are set
  const isFormValid = year && month && week && fromDate !== null;

  // Fetch events only when searchDate is set (button clicked)
  const { data: eventsData, isLoading } = useGetEvents(searchDate);

  // Handle filter button click
  const handleFilter = () => {
    if (fromDate) {
      setSearchDate(fromDate);
    }
  };

  // Format date string for display
  // Backend format: "2026-01-22 21:22:00.000000" -> Display: "22/01/2026 21:22"
  const formatDateForDisplay = (dateString: string): string => {
    try {
      // Remove fractional seconds if present
      const cleanDate = dateString.split('.')[0].trim();
      
      // Parse YYYY-MM-DD HH:mm:ss format
      if (cleanDate.includes(' ')) {
        const [datePart, timePart] = cleanDate.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart ? timePart.split(':') : ['00', '00'];
        
        // Format as DD/MM/YYYY HH:mm
        return `${day}/${month}/${year} ${hour}:${minute}`;
      } else if (cleanDate.includes('T')) {
        // Handle ISO format with T
        const [datePart, timePart] = cleanDate.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart ? timePart.split(':') : ['00', '00'];
        
        return `${day}/${month}/${year} ${hour}:${minute}`;
      }
      
      return dateString; // Return as-is if can't parse
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Generate year options (current year ± 5 years)
  const currentYear = today.year;
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Month options
  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Week options
  const weekOptions = [
    { value: 1, label: "Week 1 (1-7)" },
    { value: 8, label: "Week 2 (8-14)" },
    { value: 15, label: "Week 3 (15-21)" },
    { value: 22, label: "Week 4 (22-end)" },
  ];

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Year</FormLabel>
            <Select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Month</FormLabel>
            <Select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Week</FormLabel>
            <Select
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
            >
              {weekOptions.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </HStack>
        
        <Button
          colorScheme="blue"
          onClick={handleFilter}
          isDisabled={!isFormValid}
          isLoading={isLoading}
          width="fit-content"
        >
          Filter Events
        </Button>
        
        {/* Events Table */}
        {searchDate && (
          <Box mt={6}>
            {isLoading ? (
              <Center py={8}>
                <Spinner size="xl" />
              </Center>
            ) : eventsData?.results && eventsData.results.length > 0 ? (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Title</Th>
                      <Th>Start</Th>
                      <Th>End</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {eventsData.results.map((event: Event) => (
                      <Tr key={event.id}>
                        <Td>{event.id}</Td>
                        <Td>{event.title}</Td>
                        <Td>{formatDateForDisplay(event.start)}</Td>
                        <Td>{formatDateForDisplay(event.end)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Box mt={4} p={4} textAlign="center" bg="gray.50" borderRadius="md">
                <Text color="gray.500">No events found for the selected period.</Text>
              </Box>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CalendarAssistant;   
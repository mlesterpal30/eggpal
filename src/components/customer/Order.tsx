import { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Badge,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { BsCart3 } from "react-icons/bs";
import { MdInfoOutline } from "react-icons/md";
import { MdEgg as MdEggIcon } from "react-icons/md";

import egglogo from "../../assets/egglogo.png";
import { useLocationService } from "../../hooks/useLocationService";
import DeliveryLocationUI from "./order/location/DeliveryLocationUI";

const EGGS_PER_TRAY = 36;

const Order = () => {
  const toast = useToast();

  // By tray + pieces
  const [trays, setTrays] = useState(0);
  const [extraPieces, setExtraPieces] = useState(0);

  // By pieces only
  const [piecesOnly, setPiecesOnly] = useState(0);

  // Which tab is active: 0 = by tray, 1 = by pieces only
  const [activeTab, setActiveTab] = useState(0);

  const location = useLocationService();

  const totalFromTray = trays * EGGS_PER_TRAY + extraPieces;
  const totalEggs = activeTab === 0 ? totalFromTray : piecesOnly;

  const handleAddToOrder = () => {
    if (totalEggs <= 0) {
      toast({
        title: "No eggs selected",
        description: "Add trays or pieces to your order.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Added to order",
      description: `${totalEggs} egg${totalEggs !== 1 ? "s" : ""} added.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // TODO: send to cart/API
  };

  const handleMarkerDragEnd = () => {
    toast({
      title: "Location updated",
      description: "Drag the pin to your exact house. We'll use this for delivery.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="md" mx="auto" p={6} fontFamily="geist">
      {/* Logo + EGGPAL FARM top left */}
      <Flex align="center" gap={3} mb={6} mt={"-20px"} ml={"-20px"}>
        <Box as="img" src={egglogo} alt="EggPal" w="20" h="20" objectFit="contain" flexShrink={0} />
        <VStack ml={"-24px"}>
            <Text fontFamily="rubik" fontSize="2xl" textColor={"blue.800"}> 
            EGGPAL
            </Text>
           
        </VStack>
     
      </Flex>

      {/* ORDER EGGS with cart icon */}
      <HStack spacing={3} mb={3}>
        <Box as={BsCart3} fontSize="2xl" color="blue.600" />
        <Text fontSize="2xl" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
          Order eggs
        </Text>
      </HStack>

      {/* Reminder / note card */}
      <Flex
        align="flex-start"
        gap={3}
        p={4}
        mb={4}
        bg="amber.50"
        borderRadius="md"
        borderWidth="1px"
        borderColor="amber.200"
      >
        <Box as={MdInfoOutline} fontSize="xl" color="amber.600" flexShrink={0} mt="1px" />
        <Text fontSize="sm" color="gray.700">
          1 tray = {EGGS_PER_TRAY} eggs. Order by tray + extra pieces, or by pieces only.
        </Text>
      </Flex>

      <DeliveryLocationUI location={location} onMarkerDragEnd={handleMarkerDragEnd} />

      {/* Location map is in DeliveryLocationUI */}

      <Tabs
        variant="enclosed"
        colorScheme="blue"
        index={activeTab}
        onChange={setActiveTab}
      >
        <TabList>
          <Tab>By tray + pieces</Tab>
          <Tab>By pieces only</Tab>
        </TabList>
        <TabPanels>
          {/* By tray + pieces */}
          <TabPanel px={0}>
            <VStack align="stretch" spacing={6}>
              <FormControl>
                <FormLabel>Trays</FormLabel>
                <Box
                  p={3}
                  mb={3}
                  bg="blue.50"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="blue.100"
                >
                  <Text fontSize="sm" color="gray.700">
                    {EGGS_PER_TRAY} eggs
                  </Text>
                </Box>
                <HStack spacing={4}>
                  <IconButton
                    aria-label="Remove tray"
                    icon={<MinusIcon />}
                    size="lg"
                    onClick={() => setTrays((n) => Math.max(0, n - 1))}
                    isDisabled={trays === 0}
                  />
                  <Input
                    type="number"
                    min={0}
                    value={trays}
                    onChange={(e) => setTrays(Math.max(0, parseInt(e.target.value) || 0))}
                    textAlign="center"
                    fontSize="xl"
                    fontWeight="bold"
                    w="20"
                  />
                  <IconButton
                    aria-label="Add tray"
                    icon={<AddIcon />}
                    size="lg"
                    onClick={() => setTrays((n) => n + 1)}
                  />
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Extra pieces</FormLabel>
                <Box
                  p={3}
                  mb={3}
                  bg="blue.50"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="blue.100"
                >
                  <Text fontSize="sm" color="gray.700">
                    Add eggs on top of trays
                  </Text>
                </Box>
                <HStack spacing={4}>
                  <IconButton
                    aria-label="Remove piece"
                    icon={<MinusIcon />}
                    size="lg"
                    onClick={() => setExtraPieces((n) => Math.max(0, n - 1))}
                    isDisabled={extraPieces === 0}
                  />
                  <Input
                    type="number"
                    min={0}
                    max={EGGS_PER_TRAY - 1}
                    value={extraPieces}
                    onChange={(e) =>
                      setExtraPieces(
                        Math.min(EGGS_PER_TRAY - 1, Math.max(0, parseInt(e.target.value) || 0))
                      )
                    }
                    textAlign="center"
                    fontSize="xl"
                    fontWeight="bold"
                    w="20"
                  />
                  <IconButton
                    aria-label="Add piece"
                    icon={<AddIcon />}
                    size="lg"
                    onClick={() =>
                      setExtraPieces((n) => Math.min(EGGS_PER_TRAY - 1, n + 1))
                    }
                    isDisabled={extraPieces >= EGGS_PER_TRAY - 1}
                  />
                </HStack>
              </FormControl>

              {(trays > 0 || extraPieces > 0) && (
                <Box
                  p={4}
                  bg="blue.50"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="blue.200"
                >
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Summary
                  </Text>
                  <Text fontWeight="semibold">
                    {trays > 0 && `${trays} tray${trays !== 1 ? "s" : ""}`}
                    {trays > 0 && extraPieces > 0 && " + "}
                    {extraPieces > 0 && `${extraPieces} piece${extraPieces !== 1 ? "s" : ""}`}
                    {" = "}
                    <Badge colorScheme="blue" fontSize="md" px={2} py={1}>
                      {totalFromTray} eggs
                    </Badge>
                  </Text>
                </Box>
              )}
            </VStack>
          </TabPanel>

          {/* By pieces only */}
          <TabPanel px={0}>
            <VStack align="stretch" spacing={4}>
              <FormControl>
                <FormLabel>Number of eggs</FormLabel>
                <Box
                  p={3}
                  mb={3}
                  bg="blue.50"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="blue.100"
                >
                  <Text fontSize="sm" color="gray.700">
                    For orders under {EGGS_PER_TRAY} eggs or when you don't need full trays
                  </Text>
                </Box>
                <HStack spacing={4}>
                  <IconButton
                    aria-label="Remove piece"
                    icon={<MinusIcon />}
                    size="lg"
                    onClick={() => setPiecesOnly((n) => Math.max(0, n - 1))}
                    isDisabled={piecesOnly === 0}
                  />
                  <Input
                    type="number"
                    min={0}
                    value={piecesOnly}
                    onChange={(e) =>
                      setPiecesOnly(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    textAlign="center"
                    fontSize="xl"
                    fontWeight="bold"
                    flex={1}
                  />
                  <IconButton
                    aria-label="Add piece"
                    icon={<AddIcon />}
                    size="lg"
                    onClick={() => setPiecesOnly((n) => n + 1)}
                  />
                </HStack>
              </FormControl>

              {piecesOnly > 0 && (
                <Box
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Summary
                  </Text>
                  <Text fontWeight="semibold">
                    <Badge colorScheme="gray" fontSize="md" px={2} py={1}>
                      {piecesOnly} egg{piecesOnly !== 1 ? "s" : ""} (pieces only)
                    </Badge>
                  </Text>
                </Box>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Divider my={6} />

      <Box>
        <Text fontSize="sm" color="gray.600" mb={2}>
          Total in this order
        </Text>
        <HStack spacing={2} mb={4} align="center">
          <Box as={MdEggIcon} fontSize="4xl" color="blue.600" />
          <Text fontSize="3xl" fontWeight="bold" color="blue.600" ml={"-10px"}>
            {totalEggs} egg{totalEggs !== 1 ? "s" : ""}
          </Text>
        </HStack>
        <Button
          colorScheme="blue"
          size="lg"
          w="full"
          onClick={handleAddToOrder}
          isDisabled={totalEggs <= 0}
        >
          Add to order
        </Button>
      </Box>
    </Box>
  );
};

export default Order;

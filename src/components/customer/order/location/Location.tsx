import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  useToast,
  Flex,
} from "@chakra-ui/react";
import { MdMyLocation, MdArrowBack } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useLocationService } from "../../../../hooks/useLocationService";
import { useLocationStore } from "../../../../store/locationStore";
import egglogo from "../../../../assets/egglogo.png";

function createMarkerIcon() {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background:#3182CE;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
}

const Location = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocationService();
  const { setLocation, locationAddress: storedAddress, locationCoords: storedCoords, locationFromGps: storedFromGps } = useLocationStore();

  // Initialize from store if available
  useEffect(() => {
    if (storedCoords && !location.locationCoords) {
      location.setLocationCoords(storedCoords);
      location.setLocationAddress(storedAddress);
      location.setLocationFromGps(storedFromGps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    if (!location.locationCoords || !location.locationAddress.trim()) {
      toast({
        title: "Location required",
        description: "Please select a location on the map or enter an address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLocation(
      location.locationAddress,
      location.locationCoords,
      location.locationFromGps
    );

    toast({
      title: "Location saved",
      description: "Your delivery location has been set.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    navigate("/");
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
      {/* Back button + Logo + EGGPAL */}
      <Flex align="center" justify="space-between" mb={6} mt={"-20px"} ml={"-20px"} mr={"-20px"}>
        <IconButton
          aria-label="Back to order"
          icon={<Box as={MdArrowBack} fontSize="xl" />}
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
        />
        <Flex align="center" gap={3}>
          <Box as="img" src={egglogo} alt="EggPal" w="20" h="20" objectFit="contain" flexShrink={0} />
          <VStack ml={"-24px"} align="flex-start">
            <Text fontFamily="rubik" fontSize="2xl" textColor={"blue.800"}>
              EGGPAL
            </Text>
          </VStack>
        </Flex>
        <Box w="10" /> {/* spacer for balance */}
      </Flex>

      {/* Page title */}
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Pick your location
      </Text>

      <FormControl mb={4}>
        <FormLabel>Delivery location</FormLabel>
        <Box
          p={3}
          mb={2}
          bg="blue.50"
          borderRadius="md"
          borderWidth="1px"
          borderColor="blue.100"
        >
          <Text fontSize="sm" color="gray.700">
            Enter your address or use the button to get your current location.
          </Text>
        </Box>
        <VStack align="stretch" spacing={2}>
          <Input
            placeholder="e.g. Street, Barangay, City"
            value={location.locationAddress}
            onChange={(e) => location.setLocationAddress(e.target.value)}
            bg="white"
            size="md"
          />
          <HStack spacing={2} wrap="wrap">
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              leftIcon={<Box as={MdMyLocation} fontSize="lg" />}
              onClick={location.handleUseMyLocation}
              isLoading={location.locationLoading}
              loadingText="Getting location…"
            >
              Use my location
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              onClick={location.handleViewOnMap}
              isLoading={location.mapLoading}
              loadingText="Finding…"
              isDisabled={!location.locationAddress.trim()}
            >
              View on map
            </Button>
          </HStack>
        </VStack>

        {location.locationCoords && (
          <Box mt={3} borderRadius="md" overflow="hidden" borderWidth="1px" borderColor="gray.200">
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2} p={2}>
              Delivery location on map
            </Text>
            <Box w="full" h="400px" position="relative" bg="gray.100" zIndex={0}>
              <MapContainer
                center={[location.locationCoords.lat, location.locationCoords.lng]}
                zoom={location.locationFromGps ? 17 : 15}
                style={{ height: "100%", width: "100%", borderRadius: "md" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[location.locationCoords.lat, location.locationCoords.lng]}
                  draggable
                  icon={createMarkerIcon()}
                  eventHandlers={{
                    dragend: (e) => {
                      const pos = e.target.getLatLng();
                      const coords = { lat: pos.lat, lng: pos.lng };
                      location.setLocationCoords(coords);
                      location.setLocationFromGps(true);
                      handleMarkerDragEnd();
                    },
                  }}
                >
                  <Popup>Delivery here. Drag the pin to your exact house.</Popup>
                </Marker>
              </MapContainer>
            </Box>
            <Box mt={2} p={2} bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.100">
              <Text fontSize="xs" color="gray.700">
                Drag the pin to your exact house location. Zoom in with the + button or scroll for
                more detail.
              </Text>
            </Box>
          </Box>
        )}
      </FormControl>

      {/* Confirm button */}
      <Button
        colorScheme="blue"
        size="lg"
        w="full"
        onClick={handleConfirm}
        isDisabled={!location.locationCoords || !location.locationAddress.trim()}
        mt={4}
      >
        Confirm location
      </Button>
    </Box>
  );
};

export default Location;

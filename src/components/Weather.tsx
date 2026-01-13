import { Flex, Text, Spinner } from "@chakra-ui/react";
import { useGetWeather } from "../hooks/WeatherRepository";
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiFog, WiDayHaze, WiThunderstorm } from "react-icons/wi";
import { ReactNode } from "react";

const getWeatherIcon = (description: string): ReactNode => {
  const desc = description.toLowerCase();
  if (desc.includes("clear") || desc.includes("sun")) {
    return <WiDaySunny className="text-3xl" color="#F6AD55" />;
  } else if (desc.includes("rain") || desc.includes("drizzle")) {
    return <WiRain className="text-3xl" color="#4299E1" />;
  } else if (desc.includes("cloud")) {
    return <WiCloudy className="text-3xl" color="#718096" />;
  } else if (desc.includes("snow")) {
    return <WiSnow className="text-3xl" color="#CBD5E0" />;
  } else if (desc.includes("fog") || desc.includes("mist")) {
    return <WiFog className="text-3xl" color="#A0AEC0" />;
  } else if (desc.includes("thunder")) {
    return <WiThunderstorm className="text-3xl" color="#4A5568" />;
  } else {
    return <WiDayHaze className="text-3xl" color="#F6AD55" />;
  }
};

const Weather = () => {
  const { data, isLoading, error } = useGetWeather();

  if (isLoading) {
    return (
      <Flex alignItems="center" gap={2} px={3}>
        <Spinner size="sm" color="gray.500" />
      </Flex>
    );
  }

  if (error || !data) {
    return null;
  }

  const description = data.weather[0]?.description || "";
  const temp = Math.round(data.main?.temp || 0);

  return (
    <Flex
      alignItems="center"
      gap={2}
      px={3}
      py={1.5}
      borderRadius="md"
      _hover={{ bg: "gray.100" }}
      transition="background 0.2s"
    >
      {getWeatherIcon(description)}
      <Flex direction="column" gap={0} alignItems="flex-start">
        <Text fontSize="sm" fontWeight="semibold" lineHeight={1}>
          {temp}°C
        </Text>
        <Text fontSize="xs" color="gray.600" textTransform="capitalize" lineHeight={1}>
          {description}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Weather;

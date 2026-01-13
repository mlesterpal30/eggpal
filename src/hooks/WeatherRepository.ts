import { useQuery } from "@tanstack/react-query";
import WeatherClient, { WeatherResponse } from "../services/weatherClient";

const getWeather = new WeatherClient("/weather");

export const useGetWeather = () => {
    return useQuery<WeatherResponse, Error>({
        queryKey: ["weather"],
        queryFn: () => getWeather.get(
          {
            params: {
              lat: 13.162700,
              lon: 121.260521,
              appid: "b51820175c1bb1f019ec23370ca8ad9b",
              units: "metric",
            },
          }
        ),
    });
};

import axios, { AxiosRequestConfig } from "axios";

export const weatherAxiosInstance = axios.create({
    baseURL: "https://api.openweathermap.org/data/2.5",
});

export interface WeatherResponse {
    weather: {
        description: string;
    }[];
    main: {
        temp: number;
    };
}


class WeatherClient {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    get = (config?: AxiosRequestConfig) => {
        return weatherAxiosInstance.get<WeatherResponse>(this.endpoint, config).then((res) => res.data);
    };
}

export default WeatherClient;


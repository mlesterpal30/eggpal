import axios, { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
	baseURL: "http://localhost:5023/api",
});

export interface FetchResponse<T> {
	results: T[];
	hasMore?: boolean;
	totalCount?: number;
	page?: number;
	pageSize?: number;
}

class APIClient<T> {
	endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = endpoint;
	}

	getAll = (config?: AxiosRequestConfig) => {
		return axiosInstance
			.get<FetchResponse<T>>(this.endpoint, config)
			.then((res) => res.data);
	};

	get = (id: number | string) => {
		return axiosInstance
			.get<T>(this.endpoint + "/" + id)
			.then((res) => res.data);
	};

    post = (data: T) => {
		return axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);
	};

	put = (id: number | string, data: T | null) => {
		return axiosInstance.put<T>(this.endpoint + "/" + id, data).then((res) => res.data);
	};

	delete = (config?: AxiosRequestConfig) => {
		return axiosInstance.delete<T>(this.endpoint, config).then((res) => res.data);
	};
}

export default APIClient;
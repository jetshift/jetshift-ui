import api from "@/lib/api";

export const fetchETLTaskChart = async (type?: string): Promise<{ status: string; count: number }[]> => {
    const response = await api.get(`/charts/etl-tasks/${type ? `?type=${type}` : ""}`);
    return response.data.statuses;
};

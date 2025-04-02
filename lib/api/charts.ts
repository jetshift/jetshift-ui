import api from "@/lib/api";

export const fetchDatabaseChart = async (): Promise<{ type: string; count: number }[]> => {
    const response = await api.get(`/charts/databases/`);
    return response.data.types;
};

export const fetchTaskChart = async (type?: string): Promise<{ status: string; count: number }[]> => {
    const response = await api.get(`/charts/tasks/${type ? `?type=${type}` : ""}`);
    return response.data.statuses;
};

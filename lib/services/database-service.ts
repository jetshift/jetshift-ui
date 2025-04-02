import api from "@/lib/api";
import {toast} from "@/hooks/use-toast";

// Create a new database entry
export const createDatabase = async (formData: any): Promise<boolean> => {
    try {
        const response = await api.post("/databases/", formData);
        const data = response.data;

        if (data.success) {
            toast({description: data.message});
            return true;
        } else {
            toast({
                variant: "destructive",
                description: data.message,
            });
            return false;
        }
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message;
        toast({
            variant: "destructive",
            description: `Database creation failed: ${message}`,
        });
        return false;
    }
};

export const updateDatabase = async (formData: any): Promise<boolean> => {
    try {
        const response = await api.patch(`/databases/${formData.id}/`, formData); // include ID here
        const data = response.data;

        if (data.success) {
            toast({description: data.message});
            return true;
        } else {
            toast({
                variant: "destructive",
                description: data.message,
            });
            return false;
        }
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message;
        toast({
            variant: "destructive",
            description: `Database update failed: ${message}`,
        });
        return false;
    }
};

// Fetch the list of databases, optionally filtered by type
export const fetchDatabaseList = async (type?: string) => {
    try {
        const response = await api.get(`/databases/${type ? `?type=${type}` : ""}`);
        return response.data.data || [];
    } catch (error: any) {
        toast({
            variant: "destructive",
            description: `Error fetching database list: ${error?.response?.data?.message || error.message}`,
        });
        return [];
    }
};

// Check the connection to a specific database
export const checkDatabaseConnection = async (id: number) => {
    try {
        const response = await api.get(`/databases/${id}/check-connection/`);

        const data = response.data;
        if (data.success) {
            toast({description: `${data.message}`});
        } else {
            toast({variant: "destructive", description: `${data.message}`});
        }
    } catch (error: any) {
        toast({
            variant: "destructive",
            description: `Error checking connection for database ID ${id}: ${error?.response?.data?.message || error.message}`,
        });
    }
};

// Delete a database by its ID
export const deleteDatabaseById = async (id: number, refreshCallback: () => void) => {
    try {
        const response = await api.delete(`/databases/${id}/`);
        const data = response.data;

        if (data.success) {
            refreshCallback();
            toast({description: `${data.message}`});
        } else {
            toast({variant: "destructive", description: `${data.message}`});
        }
    } catch (error: any) {
        toast({
            variant: "destructive",
            description: `Error deleting database ID ${id}: ${error?.response?.data?.message || error.message}`,
        });
    }
};

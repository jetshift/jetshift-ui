import api from "@/lib/api";
import {toast} from "@/hooks/use-toast";

// Create a new user
export const createUser = async (formData: any): Promise<boolean> => {
    try {
        const response = await api.post("/users/", formData);
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

// Update user
export const updateUser = async (formData: any): Promise<boolean> => {
    try {
        const response = await api.patch(`/users/${formData.id}/`, formData); // include ID here
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

// Fetch the list of users
export const fetchUserList = async () => {
    try {
        const response = await api.get(`/users/`);
        return response.data.data || [];
    } catch (error: any) {
        toast({
            variant: "destructive",
            description: `Error fetching database list: ${error?.response?.data?.message || error.message}`,
        });
        return [];
    }
};


// Delete
export const deleteById = async (id: number, refreshCallback: () => void) => {
    try {
        const response = await api.delete(`/users/${id}/`);
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

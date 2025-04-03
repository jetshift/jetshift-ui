import api from "@/lib/api";
import {toast} from "@/hooks/use-toast";

export const subTaskService = () => {

    const createSubTask = async (formData: any): Promise<boolean> => {
        try {
            const response = await api.post("/subtasks/", formData);
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

    const updateSubTask = async (formData: any): Promise<boolean> => {
        try {
            const response = await api.patch(`/subtasks/${formData.id}/`, formData); // include ID here
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

    const deleteSubTaskById = async (id: number, refreshCallback: () => void) => {
        try {
            const response = await api.delete(`/subtasks/${id}/`);
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

    return {createSubTask, updateSubTask, deleteSubTaskById};
};

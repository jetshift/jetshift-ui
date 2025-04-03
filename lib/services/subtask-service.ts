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
            return response.data;
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Error deleting database ID ${id}: ${error?.response?.data?.message || error.message}`,
            });
        }
    };

    const changeTaskStatus = async (task_id: number, status: string) => {
        try {
            const response = await api.get(`/task-details/${task_id}/change-task-status/?status=${status}`);
            return response.data;
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Failed to change task status: ${error?.response?.data?.message || error.message}`,
            });
            throw error;
        }
    };

    return {createSubTask, updateSubTask, deleteSubTaskById, changeTaskStatus};
};

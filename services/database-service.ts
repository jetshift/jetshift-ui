import {toast} from "@/hooks/use-toast";

export const fetchDatabaseList = async (type?: string) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/databases/${type ? `?type=${type}` : ""}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch databases");
    }

    const data = await response.json();
    return data.data || [];
};

export const checkDatabaseConnection = async (id: number) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/databases/${id}/check-connection/`,
            {method: "GET"}
        );

        if (response.status === 400) {
            const data = await response.json();
            toast({
                variant: "destructive",
                description: `${data.message}`,
            });
            return;
        }

        if (!response.ok) {
            toast({
                variant: "destructive",
                description: `Failed to check database connection. Status: ${response.status}`,
            });
            return;
        }

        const data = await response.json();

        if (data.success) {
            toast({description: `${data.message}`});
        } else {
            toast({variant: "destructive", description: `${data.message}`});
        }
    } catch (error) {
        toast({
            variant: "destructive",
            description: `Error checking connection for ID ${id}: ${error}`,
        });
    }
};

export const deleteDatabaseById = async (id: number, refreshCallback: () => void) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/databases/${id}/`,
            {method: "DELETE"}
        );

        if (!response.ok) {
            throw new Error("Failed to delete database");
        }

        const data = await response.json();

        if (data.success) {
            refreshCallback();
            toast({description: `${data.message}`});
        } else {
            toast({variant: "destructive", description: `${data.message}`});
        }
    } catch (error) {
        toast({
            variant: "destructive",
            description: `Error deleting database ID ${id}: ${error}`,
        });
    }
};

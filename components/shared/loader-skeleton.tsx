import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoaderSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    loading: boolean;
}

export default function LoaderSkeleton({ loading, className, ...props }: LoaderSkeletonProps) {
    return (
        <div
            className={cn(
                "space-y-4 p-6 transition-opacity duration-300",
                loading ? "opacity-100" : "opacity-0",
                className
            )}
            {...props}
        >
            <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-5 gap-4">
                    {[...Array(5)].map((_, index) => (
                        <Skeleton key={index} className="h-4 w-full" />
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                {[...Array(6)].map((_, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-5 gap-4">
                        {[...Array(5)].map((_, colIndex) => (
                            <Skeleton key={colIndex} className="h-4 w-full" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

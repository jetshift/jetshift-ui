import {Button} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {FolderOpenIcon} from "lucide-react";

interface EmptyStateProps {
    message?: string;
    actionHref?: string;
    actionLabel?: string;
    className?: string;
}

export default function EmptyState(
    {
        message = "No items found!",
        actionHref,
        actionLabel = "Create New",
        className,
    }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center text-center py-20 space-y-4", className)}>
            <FolderOpenIcon className="w-12 h-12 text-muted-foreground"/>
            <div className="text-muted-foreground text-sm">{message}</div>
            {actionHref && (
                <Link href={actionHref}>
                    <Button variant="default">{actionLabel}</Button>
                </Link>
            )}
        </div>
    );
}

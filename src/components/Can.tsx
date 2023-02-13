import { useCan } from "@/hooks/useCan";
import { ReactNode } from "react";

interface CanProps {
    children: ReactNode;
    permissions?: string[];
    roles?: string[];
}

export const Can = (data: CanProps) => {
    const userCanSeeComponent = useCan({
        permissions: data.permissions,
        roles: data.roles
    });
    if (!userCanSeeComponent) {
        return null;
    }

    return (
        <>
            {data.children}
        </>
    );
}
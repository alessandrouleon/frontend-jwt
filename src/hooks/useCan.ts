import { AuthContext } from "@/contexts/AuthContext";
import { validateUserPermissions } from "@/utils/validationUserPermissions";
import { useContext } from "react";

type UseCanParams = {
    permissions?: string[];
    roles?: string[];
}

export function useCan({ permissions, roles }: UseCanParams) {
    const { user, isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        return false;
    }

    const userHasValidetPermitions = validateUserPermissions({
        user,
        permissions,
        roles
    });
   
    return userHasValidetPermitions;
}
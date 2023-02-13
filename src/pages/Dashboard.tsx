import { AuthContext } from "@/contexts/AuthContext";
import { setupApiClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react";

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        api.get('/me')
            .then(response => { console.log(response) })
            .catch((err) => console.log(err))
    });
    return (
        <div>
            <h1>Dashboard</h1>
            <h2>{user?.email}</h2>
        </div>
    );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx);
    const response = await apiClient.get('/me');

    return {
        props: {}
    }
});

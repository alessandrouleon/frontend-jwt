import { setupApiClient } from "@/services/api";
import { withSSRAuth } from "@/utils/withSSRAuth";
import decode from 'jwt-decode';


export default function Metrics() {
    return (
        <>
            <h1>Métrics</h1>
        </>
    );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx);
    await apiClient.get('/me');

    return {
        props: {}
    }
}, {
    permissions: ['metrics.list'],
    roles: ['administrator'],
}
);
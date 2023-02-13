import { Can } from "@/components/Can";
import { AuthContext } from "@/contexts/AuthContext";
import { setupApiClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { useContext, useEffect } from "react";

export default function Dashboard() {
    const { user, signOut } = useContext(AuthContext);

    // const useCanSeeMetrics = useCan({
    //     roles: ['administrator', 'editor']
       
    // });
    
    useEffect(() => {
        api.get('/me')
            .then(response => { console.log(response) })
            .catch((err) => console.log(err))
    });
    return (
        <div>
          
            <h1>Dashboard {user?.email}</h1>
            <button type="button" onClick={signOut}>signOut</button>
           {/* {useCanSeeMetrics && <div>Métrica 11</div>} */}
            <Can permissions={['metrics.list']}>
                <div>Métrica</div>
            </Can>
        </div>
    );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx);
    await apiClient.get('/me');

    return {
        props: {}
    }
});

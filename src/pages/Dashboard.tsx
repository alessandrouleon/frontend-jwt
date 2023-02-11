import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { use, useContext, useEffect } from "react";

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
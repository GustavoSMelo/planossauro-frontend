import type { IHealthCheck } from "../interfaces/api/healthCheck.interface";
import backendApi from "./api";

const isApiHealth = async () => {
    try {
        const healthResponse = await backendApi.get('/health');

        if (healthResponse.status > 300) {
            sessionStorage.setItem('backendOfflineError', 'API is not running');
            return false;
        };

        const healthServicesStatus = healthResponse.data as IHealthCheck;

        if (healthServicesStatus.api.status !== 200) {
            sessionStorage.setItem('backendOfflineError', 'API is not running');
            return false
        };

        if (healthServicesStatus.database.status !== 200) {
            sessionStorage.setItem('backendOfflineError', 'Database is not connected');
            return false
        };

        if (healthServicesStatus.github_api.status !== 200) {
            sessionStorage.setItem('backendOfflineError', 'Github API is offline');
            return false
        };
    } catch (err) {
        sessionStorage.setItem('backendOfflineError', 'API is not running');
        return false;
    }
};

export default isApiHealth;

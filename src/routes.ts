import { createRouter, createWebHistory } from 'vue-router';
import LPComponent from './views/LandingPage.vue';
import type { IRoutes } from './interfaces/routes.interface';

const routes: Array<IRoutes> = [
    { path: '', component: LPComponent },
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

export default router;

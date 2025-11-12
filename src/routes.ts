import { createRouter, createWebHistory } from 'vue-router';
import type { IRoutes } from './interfaces/routes.interface';
import LPComponent from './views/LandingPage.vue';
import HomePage from './views/HomePage.vue';
import LoginPage from './views/LoginPage.vue';
import GithubCallback from './views/callbacks/GithubCallback.vue';
import FinishRegister from './views/FinishRegister.vue';

const routes: Array<IRoutes> = [
    { path: '', component: LPComponent },
    { path: '/home', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/finish/login', component: FinishRegister },
    { path: '/callback/github', component: GithubCallback },
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

export default router;

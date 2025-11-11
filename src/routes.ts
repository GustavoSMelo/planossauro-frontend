import { createRouter, createWebHistory } from 'vue-router';
import LPComponent from './views/LandingPage.vue';
import type { IRoutes } from './interfaces/routes.interface';
import HomePage from './views/HomePage.vue';
import LoginPage from './views/LoginPage.vue';
import GithubCallback from './views/callbacks/GithubCallback.vue';

const routes: Array<IRoutes> = [
    { path: '', component: LPComponent },
    { path: '/home', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/callback/github', component: GithubCallback }
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

export default router;

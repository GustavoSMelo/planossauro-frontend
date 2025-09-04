import { createRouter, createWebHistory } from 'vue-router';
import LPComponent from './views/LandingPage.vue';
import HomePage from './views/HomePage.vue';

const routes = [
    { path: '', component: LPComponent },
    { path: '/home', component: HomePage}
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

export default router;

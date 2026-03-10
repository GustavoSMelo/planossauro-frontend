import { createRouter, createWebHistory } from "vue-router";
import type { IRoutes } from "./interfaces/routes.interface";
import LPComponent from "./views/LandingPage.vue";
import AppPage from "./views/AppPage.vue";
import LoginPage from "./views/LoginPage.vue";
import GithubCallback from "./views/callbacks/GithubCallback.vue";
import FinishRegister from "./views/FinishRegister.vue";
import BackendOffline from "./views/errors/BackendOffline.vue";
import NotFound from "./views/errors/NotFound.vue";
import GoogleCallback from "./views/callbacks/GoogleCallback.vue";
import Unauthorized from "./views/errors/Unauthorized.vue";
import PaymentCallback from "./views/callbacks/PaymentCallback.vue";
import DeleteCallback from "./views/callbacks/DeleteCallback.vue";
import SupportPage from "./views/SupportPage.vue";
import AboutPage from "./views/AboutPage.vue";
import LearnPage from "./views/LearnPage.vue";

const routes: Array<IRoutes> = [
    { path: "/:catchAll(.*)", component: NotFound },
    { path: "", component: LPComponent },
    { path: "/app", component: AppPage },
    { path: "/login", component: LoginPage },
    { path: "/finish/login", component: FinishRegister },
    { path: "/callback/github", component: GithubCallback },
    { path: "/callback/google", component: GoogleCallback },
    { path: "/callback/payment", component: PaymentCallback },
    { path: "/callback/user/delete", component: DeleteCallback },
    { path: "/offline", component: BackendOffline },
    { path: "/unauthorizated", component: Unauthorized },
    { path: "/support", component: SupportPage },
    { path: "/about", component: AboutPage },
    { path: "/learn", component: LearnPage },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

export default router;

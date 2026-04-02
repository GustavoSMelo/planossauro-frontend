import { createI18n } from "vue-i18n";

import loginPTBR from "./locales/pt-BR/login.json";
import loginENUS from "./locales/en-US/login.json";

import navbarPTBR from "./locales/pt-BR/navbar.json";
import navbarENUS from "./locales/en-US/navbar.json";

import homePTBR from "./locales/pt-BR/home.json";
import homeENUS from "./locales/en-US/home.json";

import designPTBR from "./locales/pt-BR/design.json";
import designENUS from "./locales/en-US/design.json";

import planningPTBR from "./locales/pt-BR/plannings.json";
import planningENUS from "./locales/en-US/plannings.json";

import plansPTBR from "./locales/pt-BR/plans.json";
import plansENUS from "./locales/en-US/plans.json";

import choosePlansPTBR from "./locales/pt-BR/choosePlan.json";
import choosePlansENUS from "./locales/en-US/choosePlan.json";

import profilePTBR from "./locales/pt-BR/profile.json";
import profileENUS from "./locales/en-US/profile.json";

import editPlanningPTBR from "./locales/pt-BR/editPlanning.json";
import editPlanningENUS from "./locales/en-US/editPlanning.json";

import removePlanningPTBR from "./locales/pt-BR/removePlanning.json";
import removePlanningENUS from "./locales/pt-BR/removePlanning.json";

import paymentCallbackPTBR from "./locales/pt-BR/paymentcallback.json";
import paymentCallbackENUS from "./locales/en-US/paymentcallback.json";

import deleteCallbackPTBR from "./locales/pt-BR/deletecallback.json";
import deleteCallbackENUS from "./locales/en-US/deletecallback.json";

import supportPTBR from "./locales/pt-BR/support.json";
import supportENUS from "./locales/en-US/support.json";

import loadingPTBR from "./locales/pt-BR/loading.json";
import loadingENUS from "./locales/en-US/loading.json";

import githubcallbackPTBR from "./locales/pt-BR/githubcallback.json";
import githubcallbackENUS from "./locales/en-US/githubcallback.json";

import googlecallbackPTBR from "./locales/pt-BR/googlecallback.json";
import googlecallbackENUS from "./locales/en-US/googlecallback.json";

import finishRegisterPTBR from "./locales/pt-BR/finishRegister.json";
import finishRegisterENUS from "./locales/en-US/finishRegister.json";

import validationCodeInputBoxPTBR from "./locales/pt-BR/validationCodeInputBox.json";
import validationCodeInputBoxENUS from "./locales/en-US/validationCodeInputBox.json";

import previewDocsPTBR from "./locales/pt-BR/previewdocs.json";
import previewDocsENUS from "./locales/en-US/previewdocs.json";

import backendOfflinePTBR from "./locales/pt-BR/backendOffline.json";
import backendOfflineENUS from "./locales/en-US/backendOffline.json";

import notFoundPTBR from "./locales/pt-BR/notFound.json";
import notFoundENUS from "./locales/en-US/notFound.json";

import unauthorizedPTBR from "./locales/pt-BR/unauthorized.json";
import unauthorizedENUS from "./locales/en-US/unauthorized.json";

import monthsPTBR from "./locales/pt-BR/months.json";
import monthsENUS from "./locales/en-US/months.json";

import learnPTBR from "./locales/pt-BR/learn.json";
import learnENUS from "./locales/en-US/learn.json";

import docsPTBR from "./locales/pt-BR/docs.json";
import docsENUS from "./locales/en-US/docs.json";

import tutorFloatPTBR from "./locales/pt-BR/tutorFloat.json";
import tutorFloatENUS from "./locales/en-US/tutorFloat.json";

import welcomeContainerPTBR from "./locales/pt-BR/welcomeContainer.json";
import welcomeContainerENUS from "./locales/en-US/welcomeContainer.json";

import videoTutorialPTBR from "./locales/pt-BR/videoTutorial.json";
import videoTutorialENUS from "./locales/en-US/videoTutorial.json";

import logoutPTBR from "./locales/pt-BR/logout.json";
import logoutENUS from "./locales/en-US/logout.json";

const i18n = createI18n({
    locale: "pt-BR",
    fallbackLocale: "en-US",
    messages: {
        "pt-BR": {
            login: loginPTBR,
            navbar: navbarPTBR,
            home: homePTBR,
            design: designPTBR,
            planning: planningPTBR,
            plans: plansPTBR,
            choosePlans: choosePlansPTBR,
            profile: profilePTBR,
            editPlanning: editPlanningPTBR,
            removePlanning: removePlanningPTBR,
            paymentcallback: paymentCallbackPTBR,
            deleteCallback: deleteCallbackPTBR,
            support: supportPTBR,
            loading: loadingPTBR,
            githubcallback: githubcallbackPTBR,
            googlecallback: googlecallbackPTBR,
            finishRegister: finishRegisterPTBR,
            validationCodeInputBox: validationCodeInputBoxPTBR,
            previewDocs: previewDocsPTBR,
            backendOffline: backendOfflinePTBR,
            notFound: notFoundPTBR,
            unauthorized: unauthorizedPTBR,
            months: monthsPTBR,
            learn: learnPTBR,
            docs: docsPTBR,
            tutorFloat: tutorFloatPTBR,
            welcomeContainer: welcomeContainerPTBR,
            videoTutorial: videoTutorialPTBR,
            logout: logoutPTBR,
        },
        "en-US": {
            login: loginENUS,
            navbar: navbarENUS,
            home: homeENUS,
            design: designENUS,
            planning: planningENUS,
            plans: plansENUS,
            choosePlans: choosePlansENUS,
            profile: profileENUS,
            editPlanning: editPlanningENUS,
            removePlanning: removePlanningENUS,
            paymentcallback: paymentCallbackENUS,
            deleteCallback: deleteCallbackENUS,
            support: supportENUS,
            loading: loadingENUS,
            githubcallback: githubcallbackENUS,
            googlecallback: googlecallbackENUS,
            finishRegister: finishRegisterENUS,
            validationCodeInputBox: validationCodeInputBoxENUS,
            previewDocs: previewDocsENUS,
            backendOffline: backendOfflineENUS,
            notFound: notFoundENUS,
            unauthorized: unauthorizedENUS,
            months: monthsENUS,
            learn: learnENUS,
            docs: docsENUS,
            tutorFloat: tutorFloatENUS,
            welcomeContainer: welcomeContainerENUS,
            videoTutorial: videoTutorialENUS,
            logout: logoutENUS,
        },
    },
});

export default i18n;

<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import backendApi from "../api/api";
import type { ILoadingContext } from "../interfaces/context/loading.interface";
import type { IPopupContext } from "../interfaces/context/popup.interface";
import { getToken } from "../helpers/token";
import type { IUser } from "../interfaces/api/user.interface";
import { useI18n } from "vue-i18n";

const title = ref("");
const category = ref("");
const description = ref("");
const files = ref<Array<File>>([]);
const ticketId = ref("");
const success = ref(false);
const { handleChangeIsLoading } = inject("isLoading") as ILoadingContext;
const { handleChangePopupInfo } = inject("popup") as IPopupContext;
const router = useRouter();
const { t } = useI18n();

const handleChangeTitle = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    title.value = target.value;
};

const handleChangeCategory = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    category.value = target.value;
};

const handleChangeDescription = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    description.value = target.value;
};

const handleUploadClick = (event: Event): void => {
    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length) handleChangeFiles(target.files);
};

const handleDropzone = (event: DragEvent): void => {
    const files = event.dataTransfer?.files;
    if (files) {
        handleChangeFiles(files);
    }
};

const handleChangeFiles = (fileList: FileList): void => {
    const helper = Array.from(fileList);
    const validFiles = helper.filter((file) =>
        ["image/png", "image/jpeg", "application/pdf", "image/webp"].includes(
            file.type,
        ),
    );

    files.value = validFiles;
};

const handleRemoveFileFromList = (removeIndex: number): void => {
    const helper = files.value.filter((_, index) => index !== removeIndex);
    files.value = [...helper];
};

const returnTempURL = (file: File) => {
    const url = URL.createObjectURL(file);
    return url;
};

const hasEmptyFields = (): boolean =>
    !title.value.length || !category.value.length || !description.value.length;

const getTicketId = (length: number = 12) => {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }

    return result;
};

const handleSendSupport = async () => {
    if (hasEmptyFields()) return;

    const uuid = sessionStorage.getItem("uuid") ?? "";

    if (!uuid) return;

    try {
        handleChangeIsLoading(true);
        ticketId.value = getTicketId();

        const formData = new FormData();

        formData.append("title", title.value);
        formData.append("description", description.value);
        formData.append("category", category.value);
        formData.append("ticketId", ticketId.value);

        for (let i = 0; i < files.value.length; i++) {
            formData.append("attachments[]", files.value[i]);
        }

        await backendApi.post(`/support/email/${uuid}`, formData);

        success.value = true;
        handleChangeIsLoading(false);
    } catch {
        handleChangeIsLoading(false);
        handleChangePopupInfo(t("support.contactSupportError"), "error", true);
    }
};

const handleGetInformations = async () => {
    try {
        const token = getToken();
        const uuid = sessionStorage.getItem("uuid");
        const user = sessionStorage.getItem("user") ?? "";

        if (!user || !user.length || user === null)
            return router.push("/unauthorizated");
        if (!token && !uuid) return router.push("/unauthorizated");

        const userInfo: IUser = JSON.parse(user);

        if (userInfo.deleted_at) return router.push("/callback/user/delete");

        handleChangeIsLoading(true);
        await backendApi.get(`/user/${uuid}`);
        handleChangeIsLoading(false);
    } catch {
        handleChangeIsLoading(false);
        router.push("/unauthorizated");
    }
};

onMounted(() => {
    handleGetInformations();
});
</script>
<template>
    <div class="supportContainer">
        <div v-if="success" class="supportSuccess">
            <i class="pi pi-check-circle"></i>
            <h2>{{ t("support.success") }}</h2>

            <b class="ticket">
                {{ t("support.ticket") }} <br />
                {{ ticketId }}
            </b>

            <p>
                <br />
                {{ t("support.supportSuccessDescription") }}
            </p>
            <button type="button" @click="router.push('/app')">
                {{ t("support.returnToApp") }}
            </button>
        </div>

        <div v-else class="supportContent">
            <header>
                <img src="../assets/DinoSupport.png" alt="dino support" />
                <h3>{{ t("support.messageDinoBob") }}</h3>
            </header>
            <form>
                <label><b>*</b>{{ t("support.title") }}</label>
                <input
                    :value="title"
                    type="text"
                    :placeholder="`${t('support.titlePlaceholder')}`"
                    @change="(event) => handleChangeTitle(event)"
                />

                <label><b>*</b> {{ t("support.category") }}: </label>
                <select
                    :value="category"
                    @change="(event) => handleChangeCategory(event)"
                >
                    <option value="" v-if="!category">
                        {{ t("support.chooseCategory") }}
                    </option>
                    <option value="pagamento">
                        {{ t("support.payments") }}
                    </option>
                    <option value="planos">{{ t("support.plans") }}</option>
                    <option value="planejamento">
                        {{ t("support.planning") }}
                    </option>
                    <option value="Sistema">{{ t("support.system") }}</option>
                    <option value="Outros">{{ t("support.others") }}</option>
                </select>

                <label><b>*</b> {{ t("support.description") }}</label>
                <textarea
                    :value="description"
                    @change="(event) => handleChangeDescription(event)"
                    :placeholder="`${t('support.descriptionPlaceholder')}`"
                ></textarea>

                <label>{{ t("support.files") }}: </label>
                <label
                    for="uploadFiles"
                    class="dropzone"
                    @dragover.prevent
                    @drop.prevent="(event) => handleDropzone(event)"
                >
                    <i class="pi pi-upload"></i>
                    {{ t("support.filesDropdown") }}
                </label>
                <input
                    class="uploadFiles hidden"
                    id="uploadFiles"
                    type="file"
                    @change="(event) => handleUploadClick(event)"
                    accept=".png,.jpg,.pdf,.jpeg,.webp"
                    multiple
                />

                <div v-if="files.length" class="listContainer">
                    <li
                        v-for="(item, index) in files"
                        :key="index"
                        class="itemList"
                    >
                        <span
                            class="itemContainer"
                            v-if="item.type === 'application/pdf'"
                        >
                            <small
                                >{{ item.name.slice(0, 8) }}.{{
                                    item.type.split("/")[1]
                                }}</small
                            >
                            <img
                                class="image"
                                src="../assets/pdf.png"
                                alt="pdf icon"
                            />
                            <i
                                class="pi pi-trash"
                                @click="handleRemoveFileFromList(index)"
                            ></i>
                        </span>
                        <span class="itemContainer" v-else>
                            <small
                                >{{ item.name.slice(0, 8) }}.{{
                                    item.type.split("/")[1]
                                }}</small
                            >
                            <img :src="returnTempURL(item)" alt="pdf icon" />
                            <i
                                class="pi pi-trash"
                                @click="handleRemoveFileFromList(index)"
                            ></i>
                        </span>
                    </li>
                </div>

                <span class="buttonsContainer">
                    <button type="button" @click="router.push('/app')">
                        {{ t("support.cancel") }}
                    </button>
                    <button
                        type="button"
                        :class="hasEmptyFields() ? 'btnDisabled' : ''"
                        @click="handleSendSupport()"
                    >
                        {{ t("support.send") }}
                    </button>
                </span>
            </form>
        </div>
    </div>
</template>
<style lang="scss" src="../styles/support.style.scss" scoped />

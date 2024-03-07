<template>
    <div>
        <div :class="{ 'flex': config.multiple, 'items-center': !config.multiple, 'justify-center': !config.multiple }">
            <div :style="{ width: typeof config.width == 'string' ? config.width : config.width + 'px', height: config.height + 'px' }"
               :class="{'relative':true,'border':true,'m-auto': config.center}"
                v-if="!config.multiple && currentItem?.url && config.showList">
                <div class="h-full w-full p-[2px]">
                    <a-image width="100%" height="100%" :src="currentItem.url" :fit="config.fit ?? 'fill'" />
                </div>
                <div
                    class="absolute h-full inset-0 bg-gray-100 opacity-0 hover:opacity-95 transition-all flex items-center justify-center">
                    <a-button size="mini" @click="removeSignImage">
                        <template #icon>
                            <icon-close class="text-black" :size="16" />
                        </template>
                    </a-button>
                </div>
            </div>
            <div v-else-if="config.multiple && config.showList" class="flex items-center justify-center"
                :style="{ height: config.height + 'px' }">
                <ma-drag-sort :list="showImgList" :isHorizontal="true" :onSortComplete="handleSort">
                    <template v-slot="{ item, index }">
                        <div :style="{ width: typeof config.width == 'string' ? config.width : config.width + 'px' }" class="relative border overflow-hidden h-full mr-2">
                            <div class="h-full w-full p-[2px]">
                                <a-image width="100%" height="100%" :src="item.url" :fit="config.fit ?? 'fill'" />
                            </div>
                            <div
                                class="absolute h-full inset-0 bg-gray-100 opacity-0 hover:opacity-95 transition-all flex items-center justify-center">
                                <a-button size="mini" @click="removeImage(index)">
                                    <template #icon>
                                        <icon-close class="text-black" :size="16" />
                                    </template>
                                </a-button>
                            </div>
                        </div>
                    </template>
                </ma-drag-sort>
            </div>
            <a-upload :custom-request="uploadImageHandler" :show-file-list="false" :multiple="config.multiple"
                :accept="config.accept ?? '.jpg,jpeg,.gif,.png,.svg,.bpm'" :disabled="config.disabled" :limit="config.limit"
                @exceed-limit="exceedLimit" v-if="hideUploadButton()">
                <template #upload-button>
                    <slot name="customer">
                        <div :style="{
                            width: typeof config.width == 'string' ? config.width : config.width + 'px',
                            height: config.height + 'px',
                        }"
                            class="upload-skin hover-custom-image bg-[rgba(0,0,0,.02)] border-dashed border flex items-center justify-center flex-col transition-all duration-100 ease-in-out hover:bg-gray-100">
                            <icon-upload class="icon" :size="26"/>
                            <div class="title">{{ config.iconTitle}}</div>
                        </div>
                        
                    </slot>
                </template>
            </a-upload>
        </div>
        <p class="titTip" v-if="config.tip">
            {{ config.tip }}
        </p>
    </div>
</template>

<script setup>
import { ref, inject, watch } from "vue";
import tool from "@/utils/tool";
import { isArray } from "lodash";
import { getFileUrl, uploadRequest } from "../js/utils";
import maDragSort from '@/components/ma-drag-sort/index.vue';
import { Message } from "@arco-design/web-vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    modelValue: { type: [String, Number, Array], default: () => { } },
});
const emit = defineEmits(["update:modelValue"]);
const config = inject("config");
const storageMode = inject("storageMode");
const showImgList = ref([]);
const signImage = ref();
const currentItem = ref({});
/**
 * 
 * 排序后回调
 * @param {*} showImgList 
 */
const handleSort = (result) => {
    let files = [];
    showImgList.value = result
    files = result.map((item) => {
        return item[config.returnType];
    });
    emit("update:modelValue", files);
};

/**
 * 上传图片超出部分截取掉重新上传
 * @param {*} fileList 
 * @param {*} files 
 */
const exceedLimit = async (fileList, files) => {
    let limit = files.length - (showImgList.value.length + files.length - config.limit)
    for (var i = 0; i < limit; i++) {
        const file = { fileItem: { file: files[i] } };
        await uploadImageHandler(file)
    }
}
const uploadImageHandler = async (options) => {
    if (!options.fileItem) return;
    if (!config.multiple) {
        currentItem.value = options.fileItem;
    }
    const file = options.fileItem.file;
    if (file.size > config.size) {
        Message.warning(file.name + " " + t("upload.sizeLimit"));
        currentItem.value = {};
        return;
    }

    const result = await uploadRequest(
        file,
        "image",
        "uploadImage",
        config.requestData
    );

    if (result) {
        result.url = tool.attachUrl(result.url, storageMode[result.storage_mode]);
        if (!config.multiple) {
            signImage.value = result[config.returnType];
            emit("update:modelValue", signImage.value);
        } else {
            showImgList.value.push(result);
            let files = [];
            files = showImgList.value.map((item) => {
                return item[config.returnType];
            });
            emit("update:modelValue", files);
        }
    }
};

const removeSignImage = () => {
    currentItem.value = {};
    signImage.value = undefined;
    emit("update:modelValue", null);
};

const removeImage = (idx) => {
    showImgList.value.splice(idx, 1);
    let files = [];
    files = showImgList.value.map((item) => {
        return item[config.returnType];
    });
    emit("update:modelValue", files);
};

const init = async () => {
    if (config.multiple) {
        if (isArray(props.modelValue) && props.modelValue.length > 0) {
            const result = await props.modelValue.map(async (item) => {
                return await getFileUrl(config.returnType, item, storageMode);
            });
            const data = await Promise.all(result);
            if (config.returnType === "url") {
                showImgList.value = data.map((url) => {
                    return { url };
                });
            } else {
                showImgList.value = data.map((item) => {
                    return { url: item.url };
                });
            }
        } else {
            showImgList.value = [];
        }
    } else if (props.modelValue) {
        if (config.returnType === "url") {
            signImage.value = props.modelValue;
            currentItem.value.url = props.modelValue;
        } else {
            const result = await getFileUrl(
                config.returnType,
                props.modelValue,
                storageMode
            );
            signImage.value = result.url;
            currentItem.value.url = result.url;
        }
        currentItem.value.percent = 100;
        currentItem.value.status = "complete";
    } else {
        removeSignImage();
    }
};

const hideUploadButton = () => {
    if (!config.multiple) {
        return currentItem.value?.url ? false : true
    } else {
        return showImgList.value.length >= config.limit ? 0 : 1
    }
}

watch(
    () => props.modelValue,
    (val) => {
        init();
    },
    {
        deep: true,
        immediate: true,
    }
);
</script>

<style lang="less" scoped>
.hover-custom-image:hover {
    border-color: rgb(var(--arcoblue-5));
}

.upload-skin{
    .title{
        font-size:12px
    }
    .icon,.title{
        
        color: var(--color-text-3);
    }
}
.titTip {
    font-size: 12px;
    line-height: 24px;
    font-weight: 400;
    color: var(--color-text-3);
    padding: 7px 0;
}
</style>

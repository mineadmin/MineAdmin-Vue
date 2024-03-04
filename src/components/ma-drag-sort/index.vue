<template>
    <TransitionGroup tag="div" name="fade" :class="containerClass">
        <div v-for="(item, index) in list" :key="index" class="custom-item" :draggable="true" @dragstart="dragstart(index)"
            @dragenter="dragenter(index)" @dragend="dragend" @dragover.prevent>
            <slot v-bind="{ item, index }" :class="slotClass">
            </slot>
        </div>
    </TransitionGroup>
</template>
<script setup>
import logListVue from '@/views/setting/crontab/logList.vue';
import { ref, computed, watch } from 'vue';

const props = defineProps({
    list: { type: Array },
    isHorizontal: { type: Boolean, default: false },
    onSortComplete: { type: Function }
});
const list = ref([]);
watch(() => props.list, (v) => {
    if (v.length > 0) {
        list.value = v;       
    }
},{immediate: true})

let startIndex, endIndex;

const dragstart = (index) => {
    startIndex = index;
};

const dragenter = (index) => {
    if (startIndex !== index) {
        endIndex = index;
        const draggedItem = list.value[startIndex];
        list.value.splice(startIndex, 1);
        list.value.splice(endIndex, 0, draggedItem);
        startIndex = endIndex;
    }
};

const dragend = () => {
    endIndex = undefined;
    if (props.onSortComplete) {
        props.onSortComplete(list.value);
    }
};

const slotClass = 'custom-slot-item';

const containerClass = computed(() => ({
    'custom-container': true,
    'horizontal-drag': props.isHorizontal
}));
</script>

<style scoped>
.custom-container {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;
    display: flex;
    flex-direction: column;
}

.horizontal-drag {
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
}

.custom-item {
    cursor: move;
    user-select: none;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-leave-active {
    position: absolute;
}
</style>

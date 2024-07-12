<!--
 * @Author: wei
 * @description: 大屏自适应容器组件
 * @LastEditTime: 2022-09-09 16:42:40
-->
<template>
    <!-- <section class="screen-box" :style="boxStyle"> -->
    <div class="screen-wrapper" ref="screenWrapper" :style="wrapperStyle">
        <slot></slot>
    </div>
    <!-- </section> -->
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { watch, defineProps, nextTick } from "vue";
let currentWidth = ref(0);
let currentHeight = ref(0);
let originalWidth = ref(0);
let originalHeight = ref(0);
let onResize = ref(null);
let observer = ref(null);
const screenWrapper = ref(null)
/**
 * 防抖函数
 * @param {T} fn
 * @param {number} delay
 * @return
 */
const debounce = (fn, delay) => {
    let timer = null;
    return function (...args) {
        timer = setTimeout(
            () => {
                console.log("监听");
                typeof fn === "function" && fn.apply(null, args);
                clearTimeout(timer);
            },
            delay > 0 ? delay : 100
        );
    };
}

const props = defineProps({
    width: {
        type: [String, Number],
        default: 1920,
    },
    height: {
        type: [String, Number],
        default: 1080,
    },
    fullScreen: {
        type: Boolean,
        default: false,
    },
    autoScale: {
        type: [Object, Boolean],
        default: true,
    },
    selfAdaption: {
        type: Boolean,
        default: true,
    },
    delay: {
        type: Number,
        default: 500,
    },
    boxStyle: {
        type: Object,
        default: () => ({}),
    },
    wrapperStyle: {
        type: Object,
        default: () => ({}),
    },
})
onMounted(() => {
    onResize = debounce(() => {
        resize()
    }, props.delay);

    nextTick(() => {
        resize();
        addListener();
    })
})
watch(() => {
    props.selfAdaption = (val) => {
        if (val) {
            resize()
            addListener()
        } else {
            clearListener()
            clearStyle()
        }
    }
})

const initSize = () => {
    return new Promise((resolve, reject) => {
        console.log(screenWrapper.value)
        //给父元素设置 overflow:hidden
        screenWrapper.value.parentNode.style.overflow = "hidden";
        screenWrapper.value.parentNode.scrollLeft = 0;
        screenWrapper.value.parentNode.scrollTop = 0;
        nextTick(() => {
            // region 获取大屏真实尺寸
            if (props.width && props.height) {
                currentWidth.value = props.width;
                currentHeight.value = props.height;
            } else {
                currentWidth.value = screenWrapper.value.clientWidth;
                currentHeight.value = screenWrapper.value.clientHeight;
            }
            // region 获取画布尺寸
            if (!originalWidth.value || !originalHeight.value) {
                originalWidth.value = window.screen.width;
                originalHeight.value = window.screen.height;
            }
            // console.log(11, originalWidth.value, currentHeight.value)
            resolve();
        })
    })

}
const updateSize = () => {
    if (currentHeight.value && currentWidth.value) {
        screenWrapper.value.style.width = `${currentWidth.value}px`;
        screenWrapper.value.style.height = `${currentHeight.value}px`;
        // console.log(1, screenWrapper.value.style.width, screenWrapper.value.style.height)
    } else {
        screenWrapper.value.style.width = `${originalWidth.value}px`;
        screenWrapper.value.style.height = `${originalHeight.value}px`;
    }
}
const handleAutoScale = (scale) => {
    if (!props.autoScale) return;
    const screen_Wrapper = screenWrapper.value;
    const domWidth = screen_Wrapper.clientWidth;
    const domHeight = screen_Wrapper.clientHeight;
    const currentWidth = document.body.clientWidth;
    const currentHeight = document.body.clientHeight;

    screenWrapper.value.style.transform = `scale(${scale},${scale}) `;
    let mx = Math.max((currentWidth - domWidth * scale) / 2, 0);
    let my = Math.max((currentHeight - domHeight * scale) / 2, 0);
    if (typeof props.autoScale === 'object') {
        // props.autoScale 对象不存在 x 或 y 属性时将 mx 或 my 设置为 0。
        // @ts-ignore
        !props.autoScale.x && (mx = 0);
        // @ts-ignore
        !props.autoScale.y && (my = 0);
    }
    console.log({
        mx,
        my,
        currentWidth,
        currentHeight,
        domWidth,
        domHeight,
        scale,
    });
    screenWrapper.value.style.margin = `${my}px ${mx}px`;
}

const updateScale = () => {
    const screen_Wrapper = screenWrapper.value;
    // 获取真实视口尺寸
    const current_Width = document.body.clientWidth;
    const current_Height = document.body.clientHeight;
    // 获取大屏最终的宽高onResize
    const realWidth = currentWidth.value || originalWidth.value;
    const realHeight = currentHeight.value || originalHeight.value;
    // 计算缩放比例
    const widthScale = current_Width / realWidth;
    const heightScale = current_Height / realHeight;
    // 若要铺满全屏，则按照各自比例缩放
    if (props.fullScreen) {
        screen_Wrapper.style.transform = `scale(${widthScale},${heightScale})`;
        return false;
    }
    // 按照宽高最小比例进行缩放
    const scale = Math.min(widthScale, heightScale);
    handleAutoScale(scale);
}
const clearStyle = () => {
    screenWrapper.value.parentNode.style.overflow = "auto";
    screenWrapper.value.style = "";
}

const clearListener = () => {
    window.removeEventListener("resize", onResize);
};
const addListener = () => {
    window.addEventListener("resize", onResize);
};
const resize = async () => {
    if (!props.selfAdaption) {
        return;
    }
    await initSize();
    updateSize();
    updateScale();
};
onBeforeUnmount(() => {
    clearListener();
});

</script>

<style scoped>
.screen-box {
    overflow: hidden;
    background-size: 100% 100%;
    background: #000;
    width: 100vw;
    height: 100vh;
}

.screen-wrapper {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 500ms;
    position: relative;
    overflow: hidden;
    z-index: 100;
    transform-origin: left top;
}
</style>
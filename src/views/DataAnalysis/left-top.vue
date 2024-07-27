<template>
    <div class="container">
        <!-- <img src="../../assets/img/柱1.png" /> -->
        <ThreeBarChart style="margin-top: -20px;" />

        <!-- <div class="box">
            <span> 今日事件总数 </span>
            <span> {{ eventSum }} </span>
        </div> -->
    </div>
</template>
<script setup>
import { ref, onMounted, defineProps } from 'vue'
import ThreeBarChart from '../../components/ThreeBarChart.vue';
const props = defineProps({
    eventSum: {
        type: Number,
        default: 0
    }
})
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .box {
        position: absolute;
        width: 210px;
        height: 210px;
        align-items: center;
        margin-top: -20px;

        span {
            display: block;
            width: 100%;
            text-align: center;
            color: #ffffff;
            font-size: 18px;
        }

        span:before {
            width: 210px;
            height: 210px;
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            background: url("../../assets/img/bqzlbg001.png") no-repeat;
            background-size: 100% 100%;
            animation: animation-rotate1 4s linear infinite;
        }

        span:nth-of-type(1) {
            font-size: 18px;
            font-weight: bold;
            margin-top: 70px;
            color: #9DF9FC
        }

        span:nth-of-type(2) {
            font-size: 28px;
            margin-top: 10px;
            color: #D3FCA0
        }
    }
}

@keyframes animation-rotate1 {
    0% {
        transform: rotatez(0deg)
    }

    100% {
        transform: rotatez(360deg)
    }
}
</style>
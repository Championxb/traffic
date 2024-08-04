<template>
    <div class="container">
        <div class="content">
            <!-- <img src="../../assets/img/双趋势图.png" style="width: 450px;margin-left: 10px;" /> -->
            <ThreeRingChart />
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import ThreeRingChart from '../../components/ThreeRingChart.vue';
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .content {}
}
</style>
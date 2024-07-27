<template>
    <div class="container">
        <ThreeCuboidBarChart style="margin-top: -20px;" />

        <div class="content">
            <!-- <img src="../../assets/img/柱2.png" style="margin-top: 40px;margin-left: 10px;" /> -->
        </div>
    </div>
</template>
<script setup>
import ThreeCuboidBarChart from '../../components/ThreeCuboidBarChart.vue';
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
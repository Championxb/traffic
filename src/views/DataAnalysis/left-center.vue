<template>
    <div class="container">
        <div class="content" style="position: relative;">
            <ThreeCuboidBarChart style=" position: absolute; top:-100px" />
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

    .content {}
}
</style>
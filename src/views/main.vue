<template>
    <ScaleScreen>
        <div class="container">
            <Header />
            <router-view />
        </div>
    </ScaleScreen>
</template>
<script setup>
import Header from '@/components/header.vue'
</script>
<style lang="scss" scoped>
.container {
    background: url('../assets/img/bg1.jpg') no-repeat center;
    background-size: 100% 100%;
    overflow: hidden;
    width: 100%;
    height: 100%;
}
</style>
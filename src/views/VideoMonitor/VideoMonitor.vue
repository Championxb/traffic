<template>
    <div class="container">
        <div id="videoPlayer" style="width: 900px;height: 500px;">
            <VideoPlayer />
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import VideoPlayer from '@/components/xgplayer/xgplayer.vue'

</script>
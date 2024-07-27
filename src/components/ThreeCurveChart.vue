<template>
    <div ref="threeContainer" class="three-container"></div>
</template>
<script setup>
import * as THREE from 'three';
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

let scene, camera, renderer;
const WIDTH = 500;
const HEIGHT = 400;
const threeContainer = ref(null);
</script>
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

function init() {
    // 初始化场景、相机和渲染器
    scene = new THREE.Scene();
    scene.background = null; // 设置背景为透明

    camera = new THREE.PerspectiveCamera(85, WIDTH / HEIGHT, 10, 1000); // 参数：视野角度，宽高比，近裁剪面，远裁剪面
    camera.position.set(0, 5, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 参数：抗锯齿，透明
    renderer.setSize(WIDTH, HEIGHT); // 设置渲染器大小
    renderer.setClearColor(0x000000, 0); // 设置渲染器的背景为透明
    threeContainer.value.appendChild(renderer.domElement);

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 创建柱子
    const barData = [
        { value: 285, total: 500, colorStart: 0x00aaff, colorEnd: 0x87cefa, label: '柱1' },
        { value: 686, total: 1000, colorStart: 0x00aaff, colorEnd: 0x87cefa, label: '柱2' },
        { value: 321, total: 700, colorStart: 0x00aaff, colorEnd: 0x87cefa, label: '柱3' },
        { value: 868, total: 1000, colorStart: 0x00aaff, colorEnd: 0x87cefa, label: '柱4' },
        { value: 333, total: 500, colorStart: 0x00aaff, colorEnd: 0x87cefa, label: '柱5' },
        { value: 333, total: 500, colorStart: 0x00aaff, colorEnd: 0x87cefa, label: '柱6' },

    ];

    const loader = new FontLoader();
    loader.load('./src/assets/fonts/SimHei_Regular.json', function (font) { // 使用支持中文的字体文件
        barData.forEach((data, index) => {
            // 创建表示值的部分
            const valueHeight = data.value / 100;
            const remainingHeight = data.total / 100 - valueHeight;

            // 创建渐变材质
            const valueGeometry = new THREE.BoxGeometry(1, valueHeight, 1);
            const valueMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    color1: { value: new THREE.Color(data.colorStart) },
                    color2: { value: new THREE.Color(data.colorEnd) },
                    opacity: { value: 0.8 } // 设置透明度值
                },
                vertexShader: `
                    varying vec3 vPosition;
                    void main() {
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color1;
                    uniform vec3 color2;
                    uniform float opacity; // 定义透明度统一变量
                    varying vec3 vPosition;
                    void main() {
                        float height = (vPosition.y + 1.0) / 2.0;
                        gl_FragColor = vec4(mix(color1, color2, height), opacity);
                    }
                `,
                side: THREE.DoubleSide,
                transparent: true
            });
            //边缘线
            const edges = new THREE.EdgesGeometry(valueGeometry);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x80FFFF }));
            line.position.set(index * 3 - 6, valueHeight / 2, 0);
            line.rotateY(Math.PI / 4); // 旋转45度
            scene.add(line);
            const valueMesh = new THREE.Mesh(valueGeometry, valueMaterial);
            valueMesh.position.set(index * 3 - 6, valueHeight / 2, 0);
            valueMesh.rotateY(Math.PI / 4); // 旋转45度
            scene.add(valueMesh);

            // 创建表示剩余部分
            const remainingGeometry = new THREE.BoxGeometry(1, remainingHeight, 1);
            const remainingMaterial = new THREE.MeshPhongMaterial({ color: data.colorEnd, transparent: true, opacity: 0.5 });
            const remainingMesh = new THREE.Mesh(remainingGeometry, remainingMaterial);
            remainingMesh.position.set(index * 3 - 6, valueHeight + remainingHeight / 2, 0);
            remainingMesh.rotateY(Math.PI / 4); // 旋转45度
            //边缘线
            const edges2 = new THREE.EdgesGeometry(remainingGeometry);
            const line2 = new THREE.LineSegments(edges2, new THREE.LineBasicMaterial({ color: 0x80FFFF }));
            line2.position.set(index * 3 - 6, valueHeight + remainingHeight / 2, 0);
            line2.rotateY(Math.PI / 4); // 旋转45度
            scene.add(line2);
            scene.add(remainingMesh);

            // 添加数值文字
            const valueTextGeometry = new TextGeometry(data.value.toString(), {
                font: font,
                size: 0.5,
                height: 0.1,
            });
            const valueTextMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const valueText = new THREE.Mesh(valueTextGeometry, valueTextMaterial);
            valueText.position.set(index * 3 - 6.5, valueHeight + remainingHeight + 0.5, 0);
            scene.add(valueText);

            // 添加标签文字
            const labelGeometry = new TextGeometry(data.label, {
                font: font,
                size: 0.5,
                height: 0.1,
            });
            const labelMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const labelText = new THREE.Mesh(labelGeometry, labelMaterial);
            labelText.position.set(index * 3 - 6.5, -1, 0);
            scene.add(labelText);
        });
    });
    // 添加地面
    const planeGeometry = new THREE.PlaneGeometry(20, 5);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x011D487A, transparent: true, opacity: 1 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.1;
    scene.add(plane);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

onMounted(() => {
    init();
});


</script>

<style scoped>
.three-container {
    /* width: 100%;
    height: 100%; */
    background: transparent;
    /* 确保容器背景透明 */
}
</style>

<template>
    <div ref="threeContainer" class="three-container"></div>
</template>
<script setup>
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { onMounted, ref } from 'vue';
let scene, camera, renderer;
const WIDTH = 500;
const HEIGHT = 400;
const threeContainer = ref(null);
function init() {
    // 初始化场景、相机和渲染器
    scene = new THREE.Scene();
    scene.background = null; // 设置背景为透明

    camera = new THREE.PerspectiveCamera(85, 4 / 3, 5, 1000);//参数：视野角度，宽高比，近裁剪面，远裁剪面
    camera.position.set(0, 5, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });//参数：抗锯齿，透明
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000, 0); // 设置渲染器的背景为透明
    threeContainer.value.appendChild(renderer.domElement);

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);


    // 创建柱子
    // const barData = [
    //     { value: 285, total: 500, color: 0xffa500, colorRemaining: 0xffd700, label: '轿车' },
    //     { value: 686, total: 1000, color: 0x00aaff, colorRemaining: 0x87cefa, label: '摩托车' },
    //     { value: 321, total: 700, color: 0x1e90ff, colorRemaining: 0x87cefa, label: '公交车' },
    //     { value: 868, total: 1000, color: 0x0000ff, colorRemaining: 0x1e90ff, label: '货车' },
    // ];
    const totalBarData = 1000
    const barData = [
        { value: 285, total: totalBarData, colorStart: 0xffa500, colorEnd: 0xffd700, label: '轿车' },
        { value: 686, total: totalBarData, colorStart: 0x00aaff, colorEnd: 0x87cefa, label: '摩托车' },
        { value: 321, total: totalBarData, colorStart: 0x1e90ff, colorEnd: 0x87cefa, label: '公交车' },
        { value: 868, total: totalBarData, colorStart: 0x0000ff, colorEnd: 0x1e90ff, label: '货车' },
    ];


    const loader = new FontLoader();
    loader.load('./src/assets/fonts/SimHei_Regular.json', function (font) {
        barData.forEach((data, index) => {
            // // 创建表示值的部分
            // const valueHeight = data.value / 100;
            // const remainingHeight = data.total / 100 - valueHeight;

            // const valueGeometry = new THREE.CylinderGeometry(2, 2, valueHeight, 32);//参数：顶部半径，底部半径，高度，圆周分段数
            // const valueMaterial = new THREE.MeshPhongMaterial({ color: data.color });
            // const valueMesh = new THREE.Mesh(valueGeometry, valueMaterial);
            // valueMesh.position.set(index * 6 - 8.5, valueHeight / 2, 0);
            // scene.add(valueMesh);

            // // 创建表示剩余部分
            // const remainingGeometry = new THREE.CylinderGeometry(2, 2, remainingHeight, 32);
            // const remainingMaterial = new THREE.MeshPhongMaterial({ color: data.colorRemaining, transparent: true, opacity: 0.5 });
            // const remainingMesh = new THREE.Mesh(remainingGeometry, remainingMaterial);
            // remainingMesh.position.set(index * 6 - 8.5, valueHeight + remainingHeight / 2, 0);
            // scene.add(remainingMesh);

            //创建表示值的部分
            const valueHeight = data.value / 100;
            const remainingHeight = data.total / 100 - valueHeight;

            // 创建渐变材质
            const valueGeometry = new THREE.CylinderGeometry(2, 2, valueHeight, 32);
            const valueMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    color1: { value: new THREE.Color(data.colorStart) },
                    color2: { value: new THREE.Color(data.colorEnd) }
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
                    varying vec3 vPosition;
                    void main() {
                        float height = (vPosition.y + 1.0) / 2.0;
                        gl_FragColor = vec4(mix(color1, color2, height), 1.0);
                    }
                `,
                side: THREE.DoubleSide
            });
            const valueMesh = new THREE.Mesh(valueGeometry, valueMaterial);
            valueMesh.position.set(index * 6 - 8.5, valueHeight / 2, 0);
            scene.add(valueMesh);

            // 创建表示剩余部分
            const remainingGeometry = new THREE.CylinderGeometry(2, 2, remainingHeight, 32);
            const remainingMaterial = new THREE.MeshPhongMaterial({ color: data.colorEnd, transparent: true, opacity: 0.5 });
            const remainingMesh = new THREE.Mesh(remainingGeometry, remainingMaterial);
            remainingMesh.position.set(index * 6 - 8.5, valueHeight + remainingHeight / 2, 0);
            scene.add(remainingMesh);

            // 添加数值文字
            const valueTextGeometry = new TextGeometry(data.value.toString(), {
                font: font,
                size: 0.8,
                depth: 0.1,
            });
            const valueTextMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const valueText = new THREE.Mesh(valueTextGeometry, valueTextMaterial);
            valueText.position.set(index * 6 - 9.2, valueHeight + 0.8, 0);
            scene.add(valueText);

            // 添加标签文字
            const labelGeometry = new TextGeometry(data.label, {
                font: font,
                size: 0.8,
                depth: 0.1,
            });
            const labelMaterial = new THREE.MeshPhongMaterial({ color: 0x33C1FF });
            const labelText = new THREE.Mesh(labelGeometry, labelMaterial);
            labelText.position.set(index * 6 - 10, -1.8, 1);
            scene.add(labelText);
        });
    });

    // 添加地面
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.1;
    // scene.add(plane);

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
    color: beige;
}
</style>
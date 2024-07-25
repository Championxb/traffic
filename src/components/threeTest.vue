<template>
    <div ref="threeContainer" class="three-container">
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { geoMercator } from 'd3-geo';
const threeContainer = ref()
// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);

//地面
const planeSize = 40;
const loader = new THREE.TextureLoader();
const texture = loader.load('./src/assets/imgs/jsonimg/地面.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);

// 创建立方体
const cubeSize = 4;
const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.position.set(cubeSize + 1, cubeSize / 2, 0);
scene.add(cube);

const sphereRadius = 3;
const sphereWidthDivisions = 32;
const sphereHeightDivisions = 16;
const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
scene.add(sphere);

// 添加光源DirectionalLight
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}
const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 2, 0.01);

makeXYZGUI(gui, light.position, 'position', updateLight);
makeXYZGUI(gui, light.target.position, 'target', updateLight);

const helper = new THREE.DirectionalLightHelper(light);
scene.add(helper);

function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
}
function updateLight() {
    light.target.updateMatrixWorld();
    helper.update();
}
updateLight();

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
function render() {
    // 将webgl渲染的canvas内容添加到body
    threeContainer.value.appendChild(renderer.domElement);
    renderer.render(scene, camera);
    //   渲染下一帧的时候就会调用render函数
    requestAnimationFrame(render);
}


onMounted(() => {
    render();
})
</script>
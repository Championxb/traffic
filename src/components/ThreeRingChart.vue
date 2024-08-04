<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<script setup>
import * as THREE from 'three';
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { CSG } from './CSGMesh'
const threeContainer = ref(null)
let scene, camera, renderer, ring1, ring2, ring3;
const WIDTH = 500;
const HEIGHT = 400;
// 创建环形柱体段
const createRingSegment = (innerRadius, outerRadius, height, color, startAngle, endAngle) => {//参数 
    const outerGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, height, 32, 1, false, startAngle, endAngle - startAngle);
    const innerGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, height, 32, 1, false, startAngle, endAngle - startAngle);

    // 减去内部圆柱体
    const innerCSG = CSG.fromGeometry(innerGeometry, 0);
    const outerCSG = CSG.fromGeometry(outerGeometry, 1);
    const ringCSG = outerCSG.subtract(innerCSG);

    // 创建材质
    const outerMaterial = new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const innerMaterial = new THREE.MeshPhongMaterial({ color: 0xF08080, transparent: true, opacity: 0, side: THREE.BackSide })

    // 创建网格
    const ringMesh = new CSG.toMesh(
        ringCSG,
        new THREE.Matrix4(),
        [innerMaterial, outerMaterial]
    );
    // const ringMesh = new THREE.Mesh(geometry, material)
    return ringMesh;
};

const init = () => {
    // 初始化场景、相机和渲染器
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(85, WIDTH / HEIGHT, 1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000, 0); // 设置渲染器的背景为透明
    threeContainer.value.appendChild(renderer.domElement);

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(5, 5, 5).normalize();
    const helper = new THREE.DirectionalLightHelper(light, 5);
    // scene.add(helper);
    scene.add(light);

    // 创建两个环形柱体段
    ring1 = createRingSegment(2, 4, 3, 0x1688f4, 0, Math.PI * 1.2);
    ring1.position.y = 10.5;
    ring1.rotateX(Math.PI / 8);
    scene.add(ring1);

    ring2 = createRingSegment(2, 4, 2, 0xf47416, Math.PI * 1.2, Math.PI * 1.5);
    ring2.position.y = 10.0;
    ring2.rotateX(Math.PI / 8);
    scene.add(ring2);

    ring3 = createRingSegment(2, 4, 1.5, 0xff4444, Math.PI * 1.5, Math.PI * 2);
    ring3.position.y = 9.75;
    ring3.rotateX(Math.PI / 8);
    scene.add(ring3);

    // const axesHelper = new THREE.AxesHelper(220);
    // scene.add(axesHelper)
    // axesHelper.position.y = 9
    // 设置相机位置
    camera.position.set(0, 10, 12);
    animate();
}

// 渲染循环
const animate = () => {
    requestAnimationFrame(animate);
    ring1.rotation.y += 0.01;
    ring2.rotation.y += 0.01;
    ring3.rotation.y += 0.01
    renderer.render(scene, camera);
};
onMounted(() => {
    init();
});

</script>
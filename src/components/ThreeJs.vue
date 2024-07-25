<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<script setup>
import * as THREE from 'three';
import { geoMercator } from 'd3-geo'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { onMounted, ref, onUnmounted } from 'vue';
import * as dat from 'dat.gui'
import { gsap } from 'gsap';

const threeContainer = ref();

const WIDTH = 1920;
const HEIGHT = 1000;

let particleArr = []
let WaveMeshArr = []//所有波动光圈集合
let uniforms2 = {
    u_time: { value: 0.0 }
};
const textureLoader = new THREE.TextureLoader(); //纹理贴图加载器
const map = new THREE.Group();
const clock = new THREE.Clock();
const stats = new Stats();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(220);
const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1050);//参数：视野角度，宽高比，近裁剪面，远裁剪面
const orbitcontrols = new OrbitControls(camera, renderer.domElement);
let labelRenderer, rotatingPointMesh, rotatingApertureMesh, mesh3;
let meshArrs, matLine, matLine2, material1, materialFloor;


// const gui = new dat.GUI();
const globalController = {
    color: "#1E90FF"
}
// 添加颜色控制
// gui.addColor(globalController, 'color').onChange(value => {
//     matLine2.color = new THREE.Color(value);
//     material1.color = new THREE.Color(value);
//     materialFloor.color = new THREE.Color(value);
// });

// 创建性能监控对象
const initStats = () => {
    // stats.showPanel(0);//显示左上角的帧数
    document.body.appendChild(stats.dom);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    // return stats;
}
const initRenderer = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000, 1.0);
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    threeContainer.value.appendChild(renderer.domElement);

    //初始化CSS2DRenderer
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(WIDTH, HEIGHT);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    threeContainer.value.appendChild(labelRenderer.domElement);
}

const initScene = () => {
    // 显示纵坐标轴
    // scene.add(axesHelper);
}
const initCamera = () => {
    // 确定相机位置 并将相机指向场景中心
    camera.position.x = 3.4;
    camera.position.y = 118;
    camera.position.z = 92;
    camera.lookAt(scene.position);
}

// 创建射线对象Ray
const raycaster = new THREE.Raycaster();
raycaster.ray.origin = camera.position;
raycaster.ray.direction = new THREE.Vector3(0, 0, 0);
let intersects = [];
renderer.domElement.addEventListener('click', function (event) {
    const pointer = new THREE.Vector2();
    // .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
    const px = event.offsetX;
    const py = event.offsetY;
    //屏幕坐标px、py转WebGL标准设备坐标x、y
    //width、height表示canvas画布宽高度
    pointer.x = (px / WIDTH) * 2 - 1;
    pointer.y = -(py / HEIGHT) * 2 + 1;
    //创建一个射线投射器`Raycaster`
    const raycaster = new THREE.Raycaster();
    //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
    // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
    raycaster.setFromCamera(pointer, camera);
    //.intersectObjects([mesh1, mesh2, mesh3])对参数中的网格模型对象进行射线交叉计算
    // 未选中对象返回空数组[],选中一个对象，数组1个元素，选中两个对象，数组两个元素
    const intersects = raycaster.intersectObjects(scene.children);
    // console.log("射线器返回的对象", intersects);
    if (intersects.length > 0) {
        intersects.forEach(item => {
            if (item.object.material.length > 1 && item.object.name) {
                if (item.object.position.y !== 3) {
                    gsap.to(item.object.position, { y: 3, duration: 1 });  // 动画到位置 (0, 3, -3)
                    gsap.to(item.object.position, { z: -3, duration: 1 });
                } else {
                    gsap.to(item.object.position, { y: 1.5, duration: 1 });  // 动画到位置 (0, 1.5, -3)
                    gsap.to(item.object.position, { z: -3, duration: 1 });
                }
            }
        })
        // const materialLength = intersects[0].object.material.length;
        // if (materialLength > 1) {
        //     intersects[0].object.material[0].color.set(0xff0000);
        // }
        // else {
        //     intersects[0].object.material.color.set(0xff0000);
        // }
    }
})


const initControls = () => {
    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    orbitcontrols.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //controls.dampingFactor = 0.25;
    //是否可以缩放
    orbitcontrols.enableZoom = true;
    //是否自动旋转
    // orbitcontrols.autoRotate = true;
    // orbitcontrols.autoRotateSpeed = 0.5;
    //设置相机距离原点的最远距离
    orbitcontrols.minDistance = 100;
    //设置相机距离原点的最远距离
    orbitcontrols.maxDistance = 150;
    // orbitcontrols.minPolarAngle = Math.PI / 180*10;
    orbitcontrols.maxPolarAngle = Math.PI / 180 * 75;//不然看到底部，超过90就看到底部了
    orbitcontrols.minPolarAngle = Math.PI / 180 * 25
    //是否开启右键拖拽
    orbitcontrols.enablePan = true;
    // orbitcontrols.addEventListener('change', printPosition);
}

const creatCube = () => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    //设置模型位置
    cube.position.set(0, 0, 0);
    // scene.add(cube);
    const animate = () => {
        requestAnimationFrame(animate);
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        orbitcontrols.update();
        stats.update();
    };

    animate();
}

const initGeoJson = () => {
    fetch('./src/assets/json/china/guangxi.json')
        .then(res => res.json())
        .then(data => {
            let jsonData = data
            // console.log(jsonData.features)
            initMap(jsonData)
            initMapMesh(jsonData)
        })
}
const initMap = (geoJson) => {
    matLine = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(1, 1, 1),
        linewidth: 0.0013,
        // vertexColors: true,
        // dashed: false,
        alphaToCoverage: true,
    })
    matLine2 = new THREE.LineBasicMaterial({
        color: "#01bdc2",
        linewidth: 0.0025,
        // vertexColors: true,
        // dashed: false,
        alphaToCoverage: true,
    });
    // d3-geo转化坐标
    const projection = geoMercator()
        .center([108.51846, 23.910513])
        .scale(800)
        .translate([0, 0]);

    geoJson.features.forEach(item => {
        const province = new THREE.Object3D()
        const coordinates = item.geometry.coordinates;
        const properties = item.properties;
        //创建光柱TODO
        initLightPoint(properties, projection);
        coordinates.forEach((multiPolygon) => {
            multiPolygon.forEach((polygon) => {
                const positions = [];
                const colors = [];
                const color = new THREE.Color();
                const linGeometry = new THREE.BufferGeometry();
                for (let i = 0; i < polygon.length; i += 1) {
                    const [x, y] = projection(polygon[i]);
                    positions.push(new THREE.Vector3(x, -y, 4.01));
                    // color.setHSL(1, 1, 1);
                    // colors.push(color.r, color.g, color.b);
                }
                //Line2
                linGeometry.setFromPoints(positions);
                // linGeometry.setColors(colors);
                const line = new THREE.Line(linGeometry, matLine);
                const line2 = new THREE.Line(linGeometry, matLine2);
                line.computeLineDistances();
                line.rotateX(-Math.PI / 2);
                line2.rotateX(-Math.PI / 2);
                line.position.set(0, 0.1, -3);
                line2.position.set(0, -3.5, -3);
                line2.computeLineDistances();
                line.scale.set(1, 1, 1);
                province.add(line);
                province.add(line2);
            });
        });
        map.add(province);
    })
    scene.add(map);
}

const initMapMesh = (geoJson) => {
    let textureMap = textureLoader.load("./src/assets/imgs/jsonimg/gz-map.jpeg");
    let texturefxMap = textureLoader.load("./srcassets/imgs/jsonimg/gz-map-fx.jpeg");
    textureMap.wrapS = THREE.RepeatWrapping; //纹理水平方向的平铺方式
    textureMap.wrapT = THREE.RepeatWrapping; //纹理垂直方向的平铺方式
    textureMap.flipY = texturefxMap.flipY = false;
    textureMap.rotation = texturefxMap.rotation =
        THREE.MathUtils.degToRad(45);
    const scale = 0.01;
    textureMap.repeat.set(scale, scale);
    texturefxMap.repeat.set(scale, scale);
    textureMap.offset.set(0.5, 0.5);
    texturefxMap.offset.set(0.5, 0.5);

    const material = new THREE.MeshPhongMaterial({
        map: textureMap,
        normalMap: texturefxMap,
        normalMapType: THREE.TangentSpaceNormalMap,
        normalScale: new THREE.Vector2(12.2, 2.2),
        color: globalController.color,
        combine: THREE.MultiplyOperation,
        transparent: false,
    });
    material1 = new THREE.MeshLambertMaterial({
        color: "#9adeff",
        transparent: true,
    });
    // d3-geo转化坐标
    const projection = geoMercator()
        .center([108.51846, 23.910513])//103.98, 30.65
        .scale(800)//2000
        .translate([0, 0]);
    // 遍历省份构建模型
    geoJson.features.forEach(item => {
        // 新建一个省份容器：用来存放省份对应的模型和轮廓线
        meshArrs = new THREE.Object3D();
        const coordinates = item.geometry.coordinates;
        const properties = item.properties;
        coordinates.forEach(MultiPolygon => {
            MultiPolygon.forEach(polygon => {
                const shape = new THREE.Shape();
                let v3ps = [];
                for (let i = 0; i < polygon.length; i++) {
                    const [x, y] = projection(polygon[i]);
                    if (i === 0) {
                        shape.moveTo(x, -y);
                    }
                    shape.lineTo(x, -y);
                    // 保存坐标
                    v3ps.push(new THREE.Vector3(x, -y, 4.02));
                }
                const extrudeSettings = {
                    depth: 2, //该属性指定图形可以拉伸多高，默认值是100
                    bevelEnabled: false, //是否给这个形状加斜面，默认加斜面。
                };
                //拉升成地图
                const geometry = new THREE.ExtrudeGeometry(
                    shape,
                    extrudeSettings
                );
                const mesh = new THREE.Mesh(geometry, [material, material1]);
                mesh.rotateX(-Math.PI / 2);
                mesh.position.set(0, 1.5, -3);
                mesh.name = properties.name;
                meshArrs.add(mesh);
                let curve = new THREE.CatmullRomCurve3(v3ps, true);//是否闭合
                // let flyLine = initFlyLine(
                //     curve,
                //     {
                //         speed: 0.4,
                //         color: new THREE.Color("#ffff00"),
                //         number: 3, //同时跑动的流光数量
                //         length: 0.2, //流光线条长度
                //         size: 4, //粗细
                //     },
                //     10000
                // );
            });
        });
        map.add(meshArrs);
    });
    scene.add(map);
}

const initLightPoint = (properties, projection) => {
    // console.log(properties)
    // 创建光柱
    let heightScaleFactor = 8 + random(1, 5) / 5;
    let lightCenter = properties.centroid || properties.center;
    let areaName = properties.name;
    // let lightCenter = properties.centroid;
    // projection用来把经纬度转换成坐标
    const [x, y] = projection(lightCenter);
    let light = createLightPillar(x, y, heightScaleFactor);
    light.position.z -= 3;
    // light.position.y = 13.31;
    map.add(light);
    //这里创建坐标
    createTextPoint(x, y, areaName);
}

const createTextPoint = (x, z, areaName) => {
    let tag = document.createElement("div");
    tag.innerHTML = areaName;
    //设置背景图片
    tag.style.background = `url(${new URL('../assets/imgs/jsonimg/tag.png', import.meta.url).href})`;
    tag.style.width = "65px";
    tag.style.textAlign = "center";
    //更改字体
    tag.style.fontFamily = "微软雅黑";
    // tag.style.background = "red"
    tag.style.backgroundSize = "100% 100%";
    // tag.className = className
    tag.style.pointerEvents = "none";
    // tag.style.visibility = 'hidden'
    tag.style.position = "absolute";
    let label = new CSS2DObject(tag);
    // console.log(areaName, "区域名字");
    // label.element.innerHTML = areaName;
    label.element.style.visibility = "visible";
    // label.element.style.border = "1px solid #fff";
    label.element.id = "label-tag";

    label.position.set(x - 1, 10, z - 3);
    scene.add(label);
}

const initLights = () => {
    //点光源和自然光
    scene.add(new THREE.AmbientLight(0x7af4ff, 1.2));
    let directionalLight1 = new THREE.DirectionalLight(0x7af4ff, 100); //037af1
    directionalLight1.position.set(-100, 10, -100);
    // 位置指示
    let helper = new THREE.DirectionalLightHelper(directionalLight1, 5);
    // scene.add(helper);
    let directionalLight2 = new THREE.DirectionalLight(0x7af4ff, 10);
    directionalLight2.position.set(100, 10, 100);
    let helper2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
    // scene.add(helper2);
    scene.add(directionalLight1);
    scene.add(directionalLight2);
}

const initFloor = () => {
    const geometry = new THREE.PlaneGeometry(400, 400);
    let texture = textureLoader.load("./src/assets/imgs/jsonimg/地板背景.png");
    materialFloor = new THREE.MeshPhongMaterial({
        color: globalController.color,
        map: texture,
        // emissive:0xffffff,
        // emissiveMap:Texture,
        transparent: true,
        opacity: 1,
        depthTest: true,
        // roughness:1,
        // metalness:0,
        depthWrite: false,
        // side: THREE.DoubleSide
    });
    let plane = new THREE.Mesh(geometry, materialFloor);
    plane.rotateX(-Math.PI / 2);
    scene.add(plane);

    let rotatingApertureTexture = textureLoader.load(
        "./src/assets/imgs/jsonimg/rotatingAperture.png"
    );
    let rotatingApertureerial = new THREE.MeshBasicMaterial({
        map: rotatingApertureTexture,
        transparent: true,
        opacity: 1,
        depthTest: true,
        depthWrite: false,
    });
    let rotatingApertureGeometry = new THREE.PlaneGeometry(100, 100);
    rotatingApertureMesh = new THREE.Mesh(
        rotatingApertureGeometry,
        rotatingApertureerial
    );
    rotatingApertureMesh.rotateX(-Math.PI / 2);
    rotatingApertureMesh.position.y = 0.02;
    rotatingApertureMesh.scale.set(1.2, 1.2, 1.2);
    scene.add(rotatingApertureMesh);

    let rotatingPointTexture = textureLoader.load(
        "./src/assets/imgs/jsonimg/rotating-point2.png"
    );
    let material2 = new THREE.MeshBasicMaterial({
        map: rotatingPointTexture,
        transparent: true,
        opacity: 1,
        depthTest: true,
        depthWrite: false,
    });

    rotatingPointMesh = new THREE.Mesh(rotatingApertureGeometry, material2);
    rotatingPointMesh.rotateX(-Math.PI / 2);
    rotatingPointMesh.position.y = 0.04;
    rotatingPointMesh.scale.set(1, 1, 1);
    scene.add(rotatingPointMesh);

    let circlePoint = textureLoader.load("./src/assets/imgs/jsonimg/circle-point.png");
    let material3 = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        map: circlePoint,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        // depthTest: false,
    });
    let plane3 = new THREE.PlaneGeometry(120, 120);
    mesh3 = new THREE.Mesh(plane3, material3);
    mesh3.rotateX(-Math.PI / 2);
    mesh3.position.y = 0.06;
    scene.add(mesh3);
}
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const createLightPillar = (x, z, heightScaleFactor = 1) => {
    let group = new THREE.Group();
    // 柱体高度
    const height = heightScaleFactor;
    // 柱体的geo,6.19=柱体图片高度/宽度的倍数
    const geometry = new THREE.PlaneGeometry(height / 6.219, height);
    // 柱体旋转90度，垂直于Y轴
    // geometry.rotateX(Math.PI / 2)
    // 柱体的z轴移动高度一半对齐中心点
    geometry.translate(0, height / 2, 0);
    // 柱子材质
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load("./src/assets/imgs/jsonimg/光柱.png"),
        color: 0x00ffff,
        transparent: true,
        depthWrite: false,
        // depthTest:false,
        side: THREE.DoubleSide,
    });
    // 光柱01
    let light01 = new THREE.Mesh(geometry, material);
    light01.renderOrder = 2;
    light01.name = "createLightPillar01";
    // 光柱02：复制光柱01
    let light02 = light01.clone();
    light02.renderOrder = 2;
    light02.name = "createLightPillar02";
    // 光柱02，旋转90°，跟 光柱01交叉
    light02.rotateY(Math.PI / 2);

    // 创建底部标点
    const bottomMesh = createPointMesh(1.5);

    // 创建光圈
    const lightHalo = createLightHalo(1.5);
    WaveMeshArr.push(lightHalo);
    // 将光柱和标点添加到组里
    group.add(bottomMesh, lightHalo, light01, light02);
    // 设置组对象的姿态
    // group = setMeshQuaternion(group, R, lon, lat)
    group.position.set(x, 4.01, z);
    return group;
}
const createPointMesh = (size) => {
    // 标记点：几何体，材质，
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load("./src/assets/imgs/jsonimg/标注.png"),
        color: 0x00ffff,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false, //禁止写入深度缓冲区数据
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 2;
    mesh.rotation.x = Math.PI / 2;
    mesh.name = "createPointMesh";
    // 缩放
    const scale = 1 * size;
    mesh.scale.set(scale, scale, scale);
    return mesh;
}
const createLightHalo = (size) => {
    // 标记点：几何体，材质，
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load("./src/assets/imgs/jsonimg/标注光圈.png"),
        color: 0x00ffff,
        side: THREE.DoubleSide,
        opacity: 0,
        transparent: true,
        depthWrite: false, //禁止写入深度缓冲区数据
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 2;
    mesh.name = "createLightHalo";
    mesh.rotation.x = Math.PI / 2;
    // 缩放
    const scale = 1.5 * size;
    mesh.size = scale; //自顶一个属性，表示mesh静态大小
    mesh.scale.set(scale, scale, scale);
    return mesh;
}

const animate = () => {
    stats.update();
    if (rotatingApertureMesh) {
        rotatingApertureMesh.rotation.z += 0.0005;
    }
    if (rotatingPointMesh) {
        rotatingPointMesh.rotation.z -= 0.0005;
    }
    if (mesh3) {
        mesh3.rotation.z += 0.0009;
    }
    if (WaveMeshArr.length) {
        WaveMeshArr.forEach(function (mesh) {
            mesh._s += 0.007;
            mesh.scale.set(mesh.size * mesh._s, mesh.size * mesh._s, mesh.size * mesh._s);
            if (mesh._s <= 1.5) {
                //mesh._s=1，透明度=0 mesh._s=1.5，透明度=1
                mesh.material.opacity = (mesh._s - 1) * 2;
            } else if (mesh._s > 1.5 && mesh._s <= 2) {
                //mesh._s=1.5，透明度=1 mesh._s=2，透明度=0
                mesh.material.opacity = 1 - (mesh._s - 1.5) * 2;
            } else {
                mesh._s = 1.0;
            }
        });
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

const init = () => {
    initStats();
    initRenderer();
    initScene();
    initLights();
    initCamera();
    initControls();
    creatCube();
    initGeoJson();
    // initPoints();
    initFloor();
    // initParticle();
    // initHelp();
}

const onWindowResize = () => {
    //   console.log("画面变化了");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
}
// window.addEventListener('resize', onWindowResize, true);

window.addEventListener("dblclick", () => {
    const fullScreenElement = document.fullscreenElement;
    if (!fullScreenElement) {
        //   双击控制屏幕进入全屏，退出全屏
        // 让画布对象全屏
        renderer.domElement.requestFullscreen();
        // labelRenderer.domElement.requestFullscreen();
    } else {
        //   退出全屏，使用document对象
        document.exitFullscreen();
    }
    // console.log(fullScreenElement);
});

onMounted(() => {
    init()
    animate()
});

onUnmounted(() => {
    gui.destroy()
})
</script>

<style scoped>
.three-container {
    width: 100%;
    height: 100%;
    /* overflow: hidden; */
    color: beige;
    background: #a12a2a;
}
</style>
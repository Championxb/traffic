<template>
    <div class="container">
        <div class="mask-overall" v-if="showMask" @click="closeMask">
            <div class="mask_content">
                <!-- <img :src="allMonitorEventList[openMaskPicIndex].picture_path"> -->
                <img :src="tempImgUrl">
            </div>
        </div>
        <el-table :data="allMonitorEventList" style="width: 100%;height: 730px;">
            <el-table-column label="事件截图" width="85">
                <template #default="scope">
                    <span style="display: flex; align-items: center;">
                        <!-- <img :src="scope.row.picture_path" style="width: 80px; height: 50px;" alt=""
                                @click="openMask(scope.$index)"> -->
                        <img :src="tempImgUrl" style="width: 80px; height: 50px; margin-right: 5px;" alt=""
                            @click="openMask(1)">
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="报警时间" width="126">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span style="margin-left: 10px">{{ scope.row.datetime }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="报警地点" width="80">
                <template #default="scope">
                    <el-tag>{{ scope.row.road_name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="报警类型" width="110">
                <template #default="scope">
                    <span style="display: flex; align-items: center;">
                        <img :src="getImageSrc(scope.row.event_name)"
                            style="width: 25px; height: 25px; margin-right: 5px;" alt="">
                        <el-tag>{{ scope.row.event_name }}</el-tag>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="事件详情">
                <template #default="scope">
                    <el-button size="small" type="success" @click="handleDetail(scope.$index, scope.row)">
                        查看详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup>
import request from '@/api/request'
import { ref, onMounted, getCurrentInstance } from 'vue'
import dayjs from "dayjs";
import { region, vehicleCountTime, vehicleType, vehicleCountAll, vehicleCountGroup } from "@/api"
const { proxy } = getCurrentInstance()
const tempImgUrl = "https://guangxigaosugonglu.oss-cn-chengdu.aliyuncs.com/image/develop/______swjtu9422_server03/1/20240716_175333_______swjtu9422_server03_视频通道1_非机动车_100016.jpg"
const getImageSrc = (eventName) => {
    return new URL(`../../assets/img/${eventName}.png`, import.meta.url).href
}

const showMask = ref(false)
const closeMask = () => {
    showMask.value = false
}
const openMaskPicIndex = ref()
const openMask = (index) => {
    openMaskPicIndex.value = index
    showMask.value = true
}
const allMonitorEventList = ref([])
const getAllData = async () => {
    let start_time = dayjs("2020-09-10")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    let params = {
        start_time,
        page: 1,
        per_page: 50,
    };

    try {
        const res = await request({
            url: proxy.Api.logs,
            method: 'get',
            params,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        })
        if (res.code === 200) {
            allMonitorEventList.value = res.data.items
        }
        //存入数据到localstorage
        localStorage.setItem('allMonitorEventList', JSON.stringify(res.data.items))
        getPicturepPath()
        console.log(allMonitorEventList.value)
    } catch (error) {
        console.log(error)
    }
}

const getRegion = async () => {
    try {
        const res = await region()
        if (res.code === 1 || res.code === 200) {
            console.log(res.data)

        }
    } catch (error) {
        console.log(error)
    }
}

// getRegion()


const getVehicleinfo = async () => {
    try {
        const res = await vehicleType()
        if (res.code === 1 || res.code === 200) {
            console.log('vehicle', res.data)

        }
    } catch (error) {
        console.log(error)
    }
}
// getVehicleinfo()

const getCertainTimeVehicleCount = async () => {
    const data = {
        road_id: 1,
        start_time: "2024-07-16 16:22:05",
        end_time: "2024-07-17 16:22:05"
    }
    const dataJson = JSON.stringify(data)
    try {
        const res = await vehicleCountTime(dataJson)
        if (res.code === 1 || res.code === 200) {
            console.log('vehicleCountTime', res.data)
        }
    } catch (error) {
        console.log(error)
    }
}
// getCertainTimeVehicleCount()
const getVehicleCountAll = async () => {
    const data = {
        road_id: 3,
    }
    try {
        const res = await vehicleCountAll(data)
        if (res.code === 1 || res.code === 200) {
            console.log('vehicleCountAll', res.data)
        }
    } catch (error) {
        console.log(error)
    }
}
// getVehicleCountAll()

const getVehicleCountGroup = async () => {
    const data = {
        road_id: 1,
        region_id: 1,
        group: "today"
    }
    const dataJson = JSON.stringify(data)
    try {
        const res = await vehicleCountGroup(dataJson)
        if (res.code === 1 || res.code === 200) {
            console.log('vehicleCountGroup', res.data)
        }
    } catch (error) {
        console.log(error)
    }
}
// getVehicleCountGroup()

const getPicturepPath = () => {
    //把allMonitorEventList.picture_path列表赋值给picture_path
    let picture_path = allMonitorEventList.value.map(item => item.picture_path.split(proxy.Api.devDomain)[1])
    let video_path = allMonitorEventList.value.map(item => item.video_path.split(proxy.Api.devDomain)[1])
    allMonitorEventList.value.forEach((item, index) => {
        item.picture_path = picture_path[index]
        item.video_path = video_path[index]
    })
}

onMounted(() => {
    if (localStorage.getItem('allMonitorEventList')) {
        allMonitorEventList.value = JSON.parse(localStorage.getItem('allMonitorEventList'))
    }
    // getAllData()
})
const handleDetail = (index, row) => {
    console.log(index, row)
}

</script>
<style lang="scss" scoped>
.container {
    .mask-overall {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1000;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.65);
        animation: move .3s linear;
        animation-fill-mode: forwards;

        .mask_content {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            width: 80%; //大小可自己定义
            height: 80%;

            img {
                width: 100%;
                // opacity: 0.8;
            }
        }

        @keyframes move {
            0% {
                opacity: 0;
            }

            100% {
                opacity: 1;
            }
        }
    }

    :deep(.el-table) thead tr {
        background-color: rgba(0, 13, 32, 0.2);
        border: none;
    }

    //表头透明化
    :deep(.el-table) thead th {
        text-align: center;
        background-color: rgba(0, 13, 32, 0.2);
        border: none;
    }

    :deep(.el-table) thead th div {
        color: #ffffff !important;
    }

    :deep(.el-table) tbody {
        background-color: rgba(0, 13, 32, 0.2);
    }

    :deep(.el-table) tbody tr td div {
        display: inline-block;
    }

    :deep(.el-table) tbody tr td {
        text-align: center;
    }

    :deep(.el-table) tbody tr {
        color: #ffffff !important;
        background-color: rgba(0, 13, 32, 0.2);
        border: none;
    }

    // 重写tablehover
    :deep(.el-table) tbody tr:hover {
        cursor: pointer;
    }

    //清除tablehover
    :deep(.el-table) {
        --el-table-border: 2px solid #292f6b;
        --el-fill-color-light: none;
        --el-border-color-lighter: none;
        --el-fill-color-blank: none;
    }

}
</style>
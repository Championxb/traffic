<template>
    <div class="container">
        <div class="content">
            <el-table :data="allMonitorEventList" style="width: 100%;height: 730px;">
                <el-table-column label="事件截图" width="80">
                    <template #default="scope">
                        <span style="display: flex; align-items: center;">
                            <img :src="scope.row.picture_path" style="width: 25px; height: 25px;" alt="">
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
    </div>
</template>
<script setup>
import request from '@/api/request'
import { ref, onMounted } from 'vue'
import dayjs from "dayjs";

const getImageSrc = (eventName) => {
    return new URL(`../../assets/img/${eventName}.png`, import.meta.url).href
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
    await request({
        url: '/event/logs',
        method: 'get',
        params,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }).then(res => {
        if (res.code === 200) {
            allMonitorEventList.value = res.data.items
        }
        //存入数据到localstorage
        localStorage.setItem('allMonitorEventList', JSON.stringify(res.data.items))
        console.log(res.data.items)
    }).catch(err => {
        console.log(err)
    })
}

onMounted(() => {
    if (localStorage.getItem('allMonitorEventList')) {
        allMonitorEventList.value = JSON.parse(localStorage.getItem('allMonitorEventList'))
    }
    getAllData()
})
const handleDetail = (index, row) => {
    console.log(index, row)
}

</script>
<style lang="scss" scoped>
.container {
    .content {
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
}
</style>
<template>
    <div class="container">
        <div class="filter-bar">
            <div class="filter-group">
                <span class="filter-label">通路选择:</span>
                <el-select v-model="value" placeholder="Select" style="width: 150px">
                    <el-option v-for="item in roadOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
            <div class="filter-group">
                <span class="filter-label">区域选择:</span>
                <el-select v-model="value" placeholder="Select" style="width: 150px">
                    <el-option v-for="item in roadOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
            <div class="filter-group">
                <span class="filter-label">报警类型:</span>
                <el-select v-model="value" placeholder="Select" style="width: 150px">
                    <el-option v-for="item in roadOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
            <div class="filter-group">
                <span class="filter-label">报警时间:</span>
                <el-date-picker v-model="value1" type="date" placeholder="Pick a day" size="default" />
                <span> ---- </span>
                <el-date-picker v-model="value2" type="date" placeholder="Pick a day" size="default" />
            </div>
            <button class="search-button">查询</button>
        </div>
        <!-- <img :src="tempImgUrl" alt=""> -->
        <dv-border-box-6 style="width: 90%;height: 800px;" :color="['#5dade2 ']" v-if="tableData !== null">
            <el-table :data="tableData" style="width: 96% ;margin:20px auto;font-size: 20px"
                :row-class-name="tableRowClassName" :height="760" :cell-style="cellStyle"
                :header-cell-style="headerCellStyle">
                <el-table-column type="index" label="事件序号" width="110" />
                <el-table-column prop="name" label="事件截图" width="120">
                    <template #default>
                        <span style="display: flex; align-items: center;justify-content: center;">
                            <img :src="tempImgUrl" style="width: 90px; height: 60px;" alt="">
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="报警时间" />
                <el-table-column prop="name" label="报警路段" />
                <el-table-column prop="name" label="报警类型" />
                <el-table-column prop="address" label="事件详情" />
                <el-table-column prop="name" label="事件视频" />
                <el-table-column prop="name" label="下载视频" />
            </el-table>
        </dv-border-box-6>
        <el-pagination size="small" background layout="prev, pager, next" :total="50" class="mt-4"
            style="margin-top: 25px;" v-if="tableData" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { eventLog } from '@/api'
import { client } from '@/utils/OSS'
const value = ref('')
const value1 = ref('')
const value2 = ref('')
// https://guangxigaosugonglu.oss-cn-chengdu.aliyuncs.com/video/develop/______swjtu9422_server03/1/20240716_175333_______swjtu9422_server03_视频通道1_非机动车_100016.mp4
const tempImgUrl = "https://guangxigaosugonglu.oss-cn-chengdu.aliyuncs.com/image/develop/______swjtu9422_server03/1/20240716_175333_______swjtu9422_server03_视频通道1_非机动车_100016.jpg"
let url = "/image/develop/______swjtu9422_server03/0/20240804_122613_______swjtu9422_server03_视频通道0_危化品车辆停车_100018.jpg"
const signUrl = client.signatureUrl(url)
console.log('签名前：' + url)
console.log('签名后：' + signUrl)
const tableData = ref([
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
])
const cellStyle = () => {
    return {
        //文字居中
        textAlign: 'center',
        border: 'none',
    }
}
const headerCellStyle = () => {
    return {
        //文字居中
        textAlign: 'center',
        //背景色
        backgroundColor: '#409EFF',
        //文字颜色
        color: '#fff',
        border: 'none',
    }
}
const tableRowClassName = ({
    row,
    rowIndex,
}) => {
    if (rowIndex % 2 === 0) {
        return 'warning-row'
    } else {
        return 'success-row'
    }
    return ''
}
const roadOptions = [
    {
        value: '道路1',
        label: '道路1',
    },
    {
        value: '道路2',
        label: '道路2',
    },
    {
        value: '道路3',
        label: '道路3',
    },
    {
        value: '道路4',
        label: '道路4',
    },
]
const getEventLog = async () => {
    const data = {
        road_id: value.value,
        region_id: value.value,
        event_code: value.value,
        start_time: value1.value,
        end_time: value2.value,
        page: 1,
        page_size: 10
    }
    try {
        const res = await eventLog(data)
        console.log(res)
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    getEventLog()
})
</script>
<style lang="scss" scoped>
.container {
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 80px);
    font-family: Arial, sans-serif;
    font-size: 25px;
    margin-top: 10px;
    background-color: #001f3f;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;

    .filter-bar {
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        gap: 10px;
        margin-bottom: 20px;
        background-color: #002855;
        padding: 20px;
        border-radius: 50px;

        .filter-group {
            display: flex;
            align-items: center;

            .filter-label {
                margin-right: 10px;
            }

            select {
                padding: 5px;
                background-color: #003366;
                color: #ffffff;
                border: 1px solid #0055a4;
                border-radius: 3px;

                option {
                    font-family: Arial, sans-serif;
                    font-size: 20px;
                }
            }
        }

        .date-input {
            padding: 5px;
            background-color: #003366;
            color: #ffffff;
            border: 1px solid #0055a4;
            border-radius: 3px;
        }

        .search-button {
            background-color: #0077be;
            color: white;
            border: none;
            padding: 6px 15px;
            border-radius: 3px;
            cursor: pointer;
        }

        .search-button:hover {
            background-color: #0099cc;
        }
    }

    :deep(.el-table) {
        --el-table-bg-color: transparent;
    }

    :deep(.el-table .warning-row) {
        --el-table-tr-bg-color: var(--el-color-warning-light-9);
    }

    :deep(.el-table .success-row) {
        --el-table-tr-bg-color: var(--el-color-success-light-9);
    }
}
</style>
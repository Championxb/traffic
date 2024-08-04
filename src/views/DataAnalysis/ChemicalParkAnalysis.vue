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
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { eventLog } from '@/api'
const value = ref('')
const value1 = ref('')
const value2 = ref('')

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

}
</style>
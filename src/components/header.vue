<template>
    <div class="header-container">
        <div class="timers">
            <div class="full_time">
                <span>{{ dateDay }}</span>
                {{ dateYear }} {{ dateWeek }}
            </div>
        </div>
        <span class="title">四川智慧高速收费站智能拥堵检测系统</span>
        <div class="menu">
            <el-menu class="menu-list" :default-active="activeIndex" mode="horizontal" @select="handleSelect"
                :ellipsis="false" background-color="#032432" text-color="#fff" active-text-color="#fff">
                <el-menu-item :class="['menu-item', activeIndex == '1' ? 'active' : '']" index="1">
                    <el-icon>
                        <House />
                    </el-icon>主页{{ }}
                </el-menu-item>
                <el-menu-item :class="['menu-item', activeIndex == '2' ? 'active' : '']" index="2">
                    <el-icon>
                        <VideoCamera />
                    </el-icon>视频监控
                </el-menu-item>
                <el-menu-item :class="['menu-item', activeIndex == '3' ? 'active' : '']" index="3">
                    <el-icon>
                        <WarningFilled />
                    </el-icon>历史查询
                </el-menu-item>
                <el-menu-item :class="['menu-item', activeIndex == '4' ? 'active' : '']" index="4">
                    <el-icon>
                        <TrendCharts />
                    </el-icon>数据分析
                </el-menu-item>
                <el-sub-menu class="menu-item" index="5-4" :teleported="false">
                    <template #title>
                        <el-icon>
                            <Tools />
                        </el-icon>配置
                    </template>
                    <el-menu-item index="4-4-1">系统配置</el-menu-item>
                    <el-menu-item index="4-4-2">用户配置</el-menu-item>
                    <el-menu-item index="4-4-3">检测配置</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </div>

        <el-button type="primary" :icon="TurnOff"
            style="border-radius: 25px; position:absolute;right: 5px;top:30px;width: 90px;"
            @click="logout">退出登录</el-button>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { TurnOff } from '@element-plus/icons-vue'
const activeIndex = ref('1')
const router = useRouter()
const dateYear = ref(null)
const dateWeek = ref(null)
const dateDay = ref(null)
const timer = ref(null)
const handleSelect = (index) => {
    activeIndex.value = index
    // // switch (index) {
    // //     case '1':
    // //         router.push('/')
    // //         break
    // //     case '2':
    // //         router.push('/video')
    // //         break
    // //     case '3':
    // //         router.push('/history')
    // //         break
    // //     case '4':
    // //         router.push('/data')
    // //         break
    // //     case '4-4-1':
    // //         router.push('/system')
    // //         break
    // //     case '4-4-2':
    // //         router.push('/user')
    // //         break
    // //     case '4-4-3':
    // //         router.push('/detection')
    // //         break
    // }
}
const logout = () => {
    if (localStorage.getItem('token')) {
        localStorage.removeItem('token')
    }

    router.push('/login')
    console.log('退出登录')
}
onMounted(() => {
    timeFn()
})
const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
onBeforeUnmount(() => {
    clearInterval(timer.value)
})

const timeFn = () => {
    timer.value = setInterval(() => {
        const date = new Date()
        let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
        let day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()
        dateYear.value = (date.getFullYear() + '-' + month + '-' + day)
        dateWeek.value = weekday[date.getDay()].toString()
        //获取时分秒
        let h = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString()
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString()
        dateDay.value = h + ':' + m + ':' + s
    }, 1000)
}
</script>
<style lang="scss" scoped>
.header-container {
    position: relative;
    background: #032432;
    height: 80px;

    .timers {
        position: absolute;
        left: 50px;
        top: 50%;
        transform: translateY(-50%);

        .full_time {
            font-size: 20px;
            font-weight: 600;
            color: #fff;

            span {
                margin-right: 10px;
            }
        }
    }

    .title {
        font-size: 25px;
        font-weight: 800;
        background: linear-gradient(to right, #01AAFF, #00EAFF 30%, #01AAFF 50%);
        background-size: 200%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shine 10s linear infinite;

        @keyframes shine {
            0% {
                background-position: 500%;
            }

            100% {
                background-position: -500%;
            }

        }

        width: 24%;
        height: 75px;

        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        line-height: 75px;
        text-align: center;
        border-bottom: 5px solid #01AAFF;
    }

    .menu {
        height: 100px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        position: absolute;
        right: 50px;

        .menu-list {
            width: 590px;
            position: relative;
            bottom: 0px;
            right: 70px;
            border: none;

            :deep(.el-menu-item, .el-menu-item) {
                border-bottom: #00EAFF;
            }

            .menu-item {
                font-size: 15px;
                font-weight: 600;
                color: #fff;
            }

            .active {
                color: #fff;
                background: #409eff;
            }
        }
    }
}
</style>

<template>
    <div class="container">
        <div class="content" style="position: relative;">
            <div class="content-left">
                <ItemWrap class="content-left-top content-item" title="报警事件总数">
                    <LeftTop :eventSum="eventSum" />
                </ItemWrap>
                <ItemWrap class="content-left-center content-item" title="报警事件">
                    <LeftCenter />
                </ItemWrap>
                <ItemWrap class="content-left-bottom content-item" title="事件统计">
                    <LeftBottom />
                </ItemWrap>
            </div>
            <div class="content-center">
                <img src="./../../assets/img/数据概况.png" alt=""
                    style="position: absolute; margin-left: 50%;transform: translate(-50%);margin-top: 10px;width: 600px;">
                <ThreeMap />
            </div>
            <div class="content-right">
                <ItemWrap class="content-right-top content-item" title="事件详情">
                    <Right />
                </ItemWrap>
            </div>
            <div class="content-bottom">
                <img src="./../../assets/img/指标统计.png" alt=""
                    style="position: absolute; margin-left: 50%;transform: translate(-50%);margin-top: -30px;">
            </div>
        </div>
    </div>
</template>
<script setup>
import LeftTop from './left-top.vue'
import LeftCenter from './left-center.vue'
import LeftBottom from './left-bottom.vue'
import ThreeMap from '@/components/ThreeMap.vue'
import Right from './right.vue'
import { onMounted, ref } from 'vue';
import request from '@/api/request'

const eventSum = ref(0)
const getEventNumber = async () => {
    await request({
        url: '/map/evenum/time',
        method: 'get',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }).then(res => {
        eventSum.value = res.data.total
    }).catch(err => {
        console.log(err)
    })
}
onMounted(() => {
    // getEventNumber()
})
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;

    .content {
        width: 100%;
        height: 100%;
        // background: #d12a2a;
        // display: flex;
        // justify-content: space-between;

        .content-left {
            position: absolute;
            // top: 0;
            // left: 0;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            // background: #110e0e;

            margin: 10px 20px;
            // width: 50%;

            .content-item {
                margin-bottom: 30px;
                display: inline-block;
                width: 500px;
                height: 300px;
            }
        }

        .content-center {
            // background: #000;
            width: 100%;
            height: 100%;
        }

        .content-right {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(0, 10%);
            // background: #110e0e;
            margin: 10px 20px;
            //居中
            display: flex;
            justify-content: center;
            align-items: center;

            .content-item {
                display: inline-block;
                width: 535px;
                height: 800px;
            }
        }
    }
}
</style>
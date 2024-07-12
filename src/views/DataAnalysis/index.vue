<template>
    <div class="container">
        <div class="content">
            <div class="content-left">
                <ItemWrap class="content-left-top content-item" title="报警事件总数">
                    <LeftTop />
                </ItemWrap>
                <ItemWrap class="content-left-center content-item" title="报警事件">
                    <LeftCenter />
                </ItemWrap>
                <ItemWrap class="content-left-bottom content-item" title="事件统计">
                    <LeftBottom />
                </ItemWrap>
            </div>
            <div class="content-right">
                <ItemWrap class="content-right-top content-item" title="事件详情">
                    <Right />
                </ItemWrap>
            </div>
        </div>
    </div>
</template>
<script setup>
import LeftTop from './left-top.vue'
import LeftCenter from './left-center.vue'
import LeftBottom from './left-bottom.vue'
import Right from './right.vue'
</script>
<style lang="scss" scoped>
.container {
    width: 100%;

    .content {
        width: 100%;
        height: 100%;
        // background: #d12a2a;
        display: flex;
        justify-content: space-between;

        .content-left {
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

        .content-right {
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
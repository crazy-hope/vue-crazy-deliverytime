<template>
    <div class="deliveryTime">
        <div class="deliveryTime-left">
            <div
                class="deliveryTime-item"
                :class="listDayIndex == index ? 'active': ''"
                v-for="(item, index) in listDay"
                :key="item.ymd"
                @click="changeDay(index)"
            >
                {{ item.ymd }}
            </div>
        </div>
        <div class="deliveryTime-right">
            <div
                class="deliveryTime-item"
                :class="selectedIndex[0] == listDayIndex && selectedIndex[1] == index ? 'active': ''"
                v-for="(item, index) in listTime"
                :key="item.hm"
                @click="changeTime(index)"
            >
                <span>{{ item.hm }}</span>
                <div class="iconWrapper" v-if="selectedIndex[0] == listDayIndex && selectedIndex[1] == index">
                    <div class="icon iconfont icon-CheckFilled" v-if="showIcon"></div>
                    <div class="slot-icon"><slot name="slot-icon"></slot></div>
                </div>
            </div>
		</div>
    </div>
</template>

<script>
export default {
    name: 'DeliveryTime',

    props: {
        unit: { // 展示单位
            type: Number,
            default: 2
        },
        openTime: { // 每天的营业开始配送时间，如果为数组，则数量和dayCount一致
            type: [Array, String],
            default: '6:30'
        },
        closeTime: { // 每天的营业截止配送时间，如果为数组，则数量和dayCount一致
            type: [Array, String],
            default: '22:30'
        },
        timeInt: { // 时间是否为整数（被5整除）
            type: Boolean,
            default: true
        },
        dayCount: { // 左侧日期天数
            type: Number,
            default: 7
        },
        showYear: {
            type: Boolean,
            default: true
        },
        deliverySpaceTime: { // 分钟， 预配送时间间隔
            type: Number,
            default: 15
        },
        deliveryInitTime: { // 分钟，订单下单前预估的最快配送时间
            type: Number,
            default: 45
        },
        showIcon: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            listDay: [], // 左侧列表
            listDayIndex: 0, // 左侧列表选中下标
            listTime: [], // 右侧列表
            listTimeIndex: 0, // 右侧列表选中下标
            selectedTime: '', // 选中的时间戳
            selectedIndex: [],
            units: [
                ['-', '-', '-', ':', ':', ':'],
                ['/', '/', '/', ':', ':', ':'],
                ['年', '月', '日', '时', '分', '秒']
            ]
        }
    },

    methods: {
        // 设置双位数
        setDouble(value) {
            if (value <= 9) {
                return '0' + value
            } else {
                return value
            }
        },
        // 设置显示的日期格式
        setDateFormat(dateInfo) {
            // 设置双位数
            let newDateInfo = {}
            for(let k in dateInfo) {
                let value = dateInfo[k]
                newDateInfo[k] = this.setDouble(value)
            }
            // 筛选日期单位
            let unit = 0
            let units = this.units
            if(this.unit > 0) {
                unit = this.unit - 1
            }
            let format = {
                ymd: (this.showYear ? newDateInfo.year + units[unit][0] : '') + newDateInfo.month + units[unit][1] + newDateInfo.day,
                hms: newDateInfo.hour + units[unit][3] + newDateInfo.minutes + units[unit][4] + newDateInfo.second,
                hm: newDateInfo.hour + units[unit][3] + newDateInfo.minutes
            }
            if(unit == 2) {
                format.ymd = format.ymd + units[unit][2],
                format.hms = format.hms + units[unit][5],
                format.hm = format.hm + units[unit][4]
            }
            return format
        },
        // 获取日期信息
        getDateNow(timestamp = '') {
            const date = new Date(timestamp)
            let dateInfo = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hour: date.getHours(),
                minutes: this.timeInt ? Math.ceil(date.getMinutes() / 5) * 5 : date.getMinutes(),
                second: date.getSeconds(),
                week: date.getDay(),
                timestamp : date.getTime(),
                isToday: new Date().getDate() == date.getDate() ? true : false
            }
            let format = this.setDateFormat(dateInfo)
            return {
                ...dateInfo,
                ...format
            }
        },
        // 获取左侧日期列表
        getDayList() {
            let listDay = []
            let today = new Date()
            for(let i = 0; i <= this.dayCount - 1; i++){
                let newToday = new Date(today)
                // 获取下一天的日期信息
                let nextDay = null
                if(i > 0) {
                    nextDay = newToday.setDate(newToday.getDate() + i)
                    nextDay = new Date(newToday).setHours(0)
                    nextDay = new Date(newToday).setMinutes(0)
                    nextDay = new Date(newToday).setSeconds(0)
                } else {
                    nextDay = newToday.setDate(newToday.getDate() + i)
                }
                listDay.push(this.getDateNow(nextDay))
                console.log(this.getDateNow(nextDay).week)
            }
            this.listDay = listDay
        },
        // 获取右侧时间列表
        getTimeList(dateInfo, start, end) {
            let list = []
            let newDateInfo = {...dateInfo}
            let startInfo = start.split(':')
            let endInfo = end.split(':')

            let maxDate = null, minDate = null

            // 判断是否是今天，是今天，就在当前时间上累加
            if(dateInfo.isToday) {
                if(newDateInfo.hour < parseInt(startInfo[0])) {
                    minDate = new Date(newDateInfo.timestamp).setHours(startInfo[0])
                    minDate = new Date(minDate).setMinutes(parseInt(startInfo[1]) + this.deliveryInitTime)
                } else if(newDateInfo.hour == parseInt(startInfo[0]) && newDateInfo.minutes < parseInt(startInfo[1])) {
                    minDate = new Date(newDateInfo.timestamp).setMinutes(parseInt(startInfo[1]) + this.deliveryInitTime)
                } else {
                    // 当前分钟 加上
                    minDate = new Date(newDateInfo.timestamp).setMinutes(newDateInfo.minutes + parseInt(this.deliveryInitTime))
                }
            } else {
                // 不是今天，就从开店时间算
                minDate = new Date(newDateInfo.timestamp).setHours(startInfo[0])
                minDate = new Date(minDate).setMinutes(parseInt(startInfo[1]) + this.deliveryInitTime)
            }
            maxDate = new Date(new Date(newDateInfo.timestamp).setHours(endInfo[0])).setMinutes(endInfo[1])

            let minTimeStamp = this.getDateNow(minDate).timestamp
            let maxTimeStamp = this.getDateNow(maxDate).timestamp
            for(let i = minTimeStamp; i < maxTimeStamp; i += this.deliverySpaceTime * 60 * 1000) {
                const date = this.getDateNow(i)
                list.push(date)
            }
            this.listTime = list
        },
        // 切换左侧日期
        changeDay(index) {
            this.listDayIndex = index
            let start = null, end = null
            // 获取某天的开店时间
            if(this.openTime instanceof Array) {
                start = this.openTime[index]
            } else if(typeof this.openTime == 'string') {
                start = this.openTime
            } else {
                return false
            }
            // 获取某天的闭店时间
            if(this.closeTime instanceof Array) {
                end = this.closeTime[index]
            } else if(typeof this.closeTime == 'string') {
                end = this.closeTime
            } else {
                return false
            }
            // 获取某天的日期信息
            const dayInfo = this.listDay[index]
            this.getTimeList(dayInfo, start, end)
        },
        // 切换右侧时间
        changeTime(index) {
            this.listTimeIndex = index
            this.selectedIndex = [this.listDayIndex, this.listTimeIndex]
            this.$emit('change', this.listTime[this.listTimeIndex])
        }
    },

    created() {
        this.getDayList()
        this.changeDay(0)
    },
}
</script>

<style lang="scss" scoped>
@import './assets/iconfont/iconfont.css';
.deliveryTime {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 300px;
    font-size: 16px;
    background: #ffffff;
    box-shadow: 0 0 5px #ddd;
    overflow: hidden;
    &-left {
        flex: 0 0 40%;
        width: 40%;
        max-width: 150px;
        height: 100%;
        overflow: auto;
        background: darken(#ffffff, 3%);
        text-align: left;
    }
    &-left &-item {
        border-bottom: 1px solid darken(#ffffff, 5%);
        &.active {
            background: #ffffff;
            color: #000;
        }
    }
    &-right {
        flex: 1 1 100%;
        height: 100%;
        overflow: auto;
    }
    &-right &-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 1px solid darken(#ffffff, 3%);
        &.active {
            color: #ff2b2b;
        }
    }
    &-item {
        padding: 10px;
        line-height: 1.4em;
        cursor: pointer;
        &:hover,
        &:active {
            background: #ffffff;
        }
    }
    .iconWrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-left: 15px;
        .icon {
            margin-right: 15px;
            color: #ff2b2b;
        }
    }
}
</style>
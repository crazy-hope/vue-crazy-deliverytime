# vue-crazy-deliverytime

![screenShot](https://github.com/crazy-hope/vue-crazy-deliverytime/blob/master/screenshot/deliverytime.png)

### 安装 `vue-crazy-deliverytime`
``` shell
yarn add vue-crazy-deliverytime
# or
npm install vue-crazy-deliverytime
```

### 引入 `vue-crazy-deliverytime`
``` javascript
// main.js
import DeliveryTime from 'vue-crazy-deliverytime'
Vue.use(DeliveryTime)
```

### 使用 `vue-crazy-deliverytime`
``` html
<template>
    <div>
        <DeliveryTime @change="changeDeliveryTime">
            <div slot="slot-icon">seleted</div>
        </DeliveryTime>
    </div>
</template>
```
``` javascript
<script>
export default {
    methods: {
        changeDeliveryTime(e) {
            console.log(e)
        }
    }
}
</script>
```

### 属性说明
| 属性 | 类型 | 默认值 | 说明 |
|-|-|-|-|
| unit | `Number` | `2` | 展示单位 |
| openTime | `[Array, String]` | `6:30` | 每天的营业开始配送时间，如果为数组，则数量和dayCount一致 |
| closeTime | `[Array, String]` | `22:30` | 每天的营业截止配送时间，如果为数组，则数量和dayCount一致 |
| timeInt | `Boolean` | `true` | 右侧的时间是否为整数（被5整除） |
| dayCount | `Number` | `7` | 左侧日期天数 |
| showYear | `Boolean` | `true` | 左侧是否显示 年 |
| deliverySpaceTime | `Number` | `15` | 分钟，预配送时间间隔 |
| deliveryInitTime | `Number` | `45` | 分钟，订单下单前预估的最快配送所需时间 |
| showIcon | `Boolean` | `true` | 右侧是否显示 选中图标 |

### 插槽
| 插槽 | 说明 |
|-|-|
| slot-icon | 可以代替默认的选中小图标 |
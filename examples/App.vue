<template>
  <div id="app">
    <div v-if="!selectedTime.length">未选择</div>
    <div v-else>
      <div
        class="timeList"
        v-for="item in selectedTime"
        :key="item.timestamp"
      >
        <div class="left">{{ item.key }}</div>
        <div class="right">{{ item.value }}</div>
      </div>
    </div>
    <DeliveryTime @change="changeDeliveryTime">
      <div slot="slot-icon">seleted</div>
    </DeliveryTime>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      selectedTime: []
    }
  },
  methods: {
    changeDeliveryTime(e) {
      let data = []
      for(let k in e) {
        data.push({
          key: k,
          value: e[k]
        })
      }
      this.selectedTime = data
    }
  }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
body {
  margin: 0;
}

.timeList {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  height: 30px;
  padding: 0 20px;
  &:nth-child(even) {
    background: #efefef;
  }
  .left,
  .right {
    flex: 0 0 50%;
  }
  .left {
    font-weight: bold;
  }
}
</style>

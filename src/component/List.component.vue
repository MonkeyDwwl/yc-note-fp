<template>
  <div>
    <el-card shadow="always" class="tab">
      {{title}}
    </el-card>
    <div v-for="item in articles" :key="item.id">
      <el-card shadow="hover"  class="cardStyle" >
        <div @click="goToLink(item.link, item.id)">
          <img :src="item.thumbPath" class="image">
          <H4 class="cardTitle">{{item.title}}</H4>
          <el-row type="flex" justify="space-around" style="text-align: left; color: darkgrey">
            <p class="cardDescription">{{item.description}}</p>
            <p class="createdTime">{{item.articlecreatedTime}}</p>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['articles', 'title']
  }
</script>
<style>
  .tab {
    background: #909399;
    margin-bottom: 20px;
    color: #fff;
  }
  .image {
    width: 100%;
    height: 180px;
  }
  .cardStyle {
    margin: 4px 0;
  }
  .cardTitle {
    width: 100%;
    height: 20px;
    text-align: left;
    font-size: 15px;
    line-height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    margin: 5px 0;
  }
  .cardDescription {
    width: 100%;
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .createdTime {
    width: 100%;
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    text-align: right;
  }
</style>

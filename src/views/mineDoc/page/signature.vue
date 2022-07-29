<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
  <div class="work-area p-5">
    <div class="ma-content-block shadow p-5">
      <div class="text-2xl">简易模式</div>
      <div class="ma-content-block shadow p-5 mt-5 leading-10">
        <div class="text-xl">身份信息</div>
        <div>
          <a-tag color="blue">MineAdmin API</a-tag>
          的简易模式在请求时需要携带
          <a-tag color="magenta">app_id</a-tag> 和 <a-tag color="magenta">identity</a-tag> 认证参数
        </div>
      </div>
      <div class="ma-content-block shadow p-5 mt-5 leading-10">
        <div class="text-xl">生成identity</div>
        <div>
          只需要对
          <a-tag color="orangered">app id</a-tag> 和 <a-tag color="orangered">app secret</a-tag>
          进行 <a-tag color="blue">MD5</a-tag> 即可
        </div>
      </div>
    </div>

    <div class="ma-content-block shadow p-5 mt-5">
      <div class="text-2xl">复杂模式</div>

      <div class="ma-content-block shadow p-5 mt-5 leading-10">
        <div class="text-xl">签名简介</div>
        <div>
          <a-tag color="blue">MineAdmin API</a-tag>
          的签名主要是用于获取身份令牌
          <a-tag color="red">AccessToken</a-tag> 时所需必要认证参数
        </div>
        <div>
          在请求需要复杂认证接口的时候，系统会验证 <a-tag color="red">AccessToken</a-tag>
        </div>
        <div>
          在请求获取 <a-tag color="red">AccessToken</a-tag>
          的接口时候，服务器会对用户请求合法性的 <a-tag color="purple">signature</a-tag>
          进行检查，以此来确定是否向用户返回 <a-tag color="red">AccessToken</a-tag>
        </div>
      </div>

      <div class="ma-content-block shadow p-5 mt-5 leading-10">
        <div class="text-xl">获取app id 和 app secret</div>
        <div>
          <div>
            进入后台管理系统后，依次点击以下导航
            <a-breadcrumb>
              <a-breadcrumb-item><a-tag >数据</a-tag></a-breadcrumb-item>
              <a-breadcrumb-item><a-tag >应用中心</a-tag></a-breadcrumb-item>
              <a-breadcrumb-item><a-tag >应用管理</a-tag></a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          获取 <a-tag color="magenta">app id</a-tag> 和 <a-tag color="magenta">app secret</a-tag>
        </div>
      </div>

      <div class="ma-content-block shadow p-5 mt-5 leading-10">
        <div class="text-xl">生成signature</div>
        <div>
          <div>
            一、组合签名数据格式
            <ma-code-editor v-model="obj" height="120" readonly />
          </div>
          <div>
            二、根据字段名降序排序，组合http原始字符串
            <ma-code-editor v-model="text" height="60" readonly />
          </div>
          <div>
            三、md5 http原始字符串，完成生成 <a-tag color="purple">signature</a-tag>
            <ma-code-editor v-model="text2" height="60" readonly />
          </div>
        </div>
      </div>

      <div class="ma-content-block shadow p-5 mt-5 leading-10">
        <div class="text-xl">获取AccessToken</div>
        <div>
          <div>1. <a-tag color="red">AccessToken</a-tag> 有效期只有 7200 秒，获取后请缓存到本地</div>
          <div>2. 有效期内再次请求的 <a-tag color="red">AccessToken</a-tag> 会导致之前请求的全部失效</div>
          <div>3. 请使用服务器端来做接口请求，客户端会出现跨域等问题。</div>
          <div>
            4. 获取 <a-tag color="red">AccessToken</a-tag> 地址：
            <a-tag color="green">http://你的服务器地址/api/v1/getAccessToken</a-tag>
            请求方法： <a-tag color="pinkpurple">POST</a-tag>
          </div>
          
          <div class="mt-5">
            组合完整请求参数
            <ma-code-editor v-model="obj2" height="100" readonly />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const obj = ref(`{
    "app_id":"到后台应用管理查看app id",
    "app_secret":"到后台应用管理查看app secret",
    "sign_ver":"1.0",
    "timestamp":"当前系统时间戳"
}`)

const text = ref(`
app_id=xxxx&app_secret=xxxxxxxxxx&sign_ver=1.0&timestamp=128097733
`)

const text2 = ref(`
2d41751369f4daaf9dd869aefa0da1e4
`)

const obj2 = ref(`{
    "app_id":"xxxx",
    "signature":"2d41751369f4daaf9dd869aefa0da1e4",
    "timestamp":128097733
}`)
</script>
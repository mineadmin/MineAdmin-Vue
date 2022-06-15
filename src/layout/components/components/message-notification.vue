<template>
  <div class="mgs-nfc rounded p-2">
    <a-tabs default-active-key="message" type="rounded">
      <a-tab-pane key="message">
        <template #title>消息 <a-badge :count="5" dot :dotStyle="{ width: '5px', height: '5px', top: '-8px' }"> </a-badge></template>
        <a-list :max-height="230">
          <a-list-item>
            <a-list-item-meta
              title="消息标题"
              description="消息内容"
            >
              <template #avatar>
                <a-avatar shape="square">
                  <img alt="avatar" src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp" />
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta
              title="消息标题"
              description="消息内容"
            >
              <template #avatar>
                <a-avatar shape="square">
                  <img alt="avatar" src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp" />
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta
              title="消息标题"
              description="消息内容"
            >
              <template #avatar>
                <a-avatar shape="square">
                  <img alt="avatar" src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp" />
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="notification" title="通知">
        Content of Tab Panel 2
      </a-tab-pane>
      <a-tab-pane key="todo" title="待办">
        Content of Tab Panel 3
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="scss">
.mgs-nfc {
  width: 400px;
  background: var(--color-bg-1);
  height: 300px;
  border: 1px solid var(--color-border-1);
  margin-right: 10px;
  margin-top: 9px;

  .arco-tabs-nav-tab {
    margin-left: 20%;
  }
}
</style>
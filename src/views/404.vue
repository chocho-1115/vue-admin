<template>
  <div class="container">
    <div class="bullshit">
      <div class="title">OOPS!</div>

      <div class="info">The webmaster said that you can not enter this page...</div>
      <div class="tips">
        Please check that the URL you entered is correct, or click the button below to return to
        the homepage.
      </div>
      <a class="btn-home" href="/">Back to home</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  min-height:100vh;
  max-width: 1200px;
  overflow: hidden;
  margin: auto;
}

.bullshit {
  max-width: 400px;
  padding: 80px 50px;
  .title {
    font-size: 32px;
    font-weight: bold;
    line-height: 1.3em;
    color: var(--el-color-primary);
    margin-bottom: 20px;
  }
  .info {
    font-size: 20px;
    line-height: 1.3em;
    color: var(--el-text-color-primary);
    font-weight: bold;
    margin-bottom: 10px;
  }
  .tips {
    font-size: 13px;
    line-height: 1.4em;
    color:var(--el-text-color-secondary);
    margin-bottom: 30px;
  }
  .btn-home {
    display: block;
    width: 110px;
    height: 36px;
    line-height: 36px;
    background: var(--el-color-primary);
    border-radius: 100px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
}

</style>

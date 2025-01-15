<!-- src/components/NotFoundPage.vue -->
<template>
    <div class="not-found">
      <h1>404</h1>
      <p>존재하지 않는 페이지입니다.</p>
      <router-link to="/">홈으로 돌아가기</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundPage',
  };
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  .not-found h1 {
    font-size: 72px;
    color: #ff6b6b;
  }
  .not-found p {
    font-size: 18px;
    color: #333;
  }
  .not-found a {
    display: inline-block;
    margin-top: 20px;
    text-decoration: none;
    color: #3498db;
    font-weight: bold;
  }
  .not-found a:hover {
    color: #2980b9;
  }
  </style>
  
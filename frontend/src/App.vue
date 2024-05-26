<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%; 
  overflow: hidden; 
}

.image-gallery {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.gallery-header {
  background-color: #8cae77;
  color: white;
  text-align: center;
  font-size: 2rem;
  padding: 10px 0;
}

.image-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.image-gallery img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

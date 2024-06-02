<template>
  <div class="image-gallery">
    <header ref="header" class="gallery-header">
      <img src="@/assets/logo1.png" alt="Logo 1" class="logo">
      <div class="header-title">Memes da Galera</div>
      <img src="@/assets/logo2.png" alt="Logo 2" class="logo">
    </header>
    <div ref="imageContainer" class="image-container">
      <img :src="currentImageUrl" alt="Loaded image" v-if="currentImageUrl">
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ImageGallery',
  data() {
    return {
      imageUrls: [],
      currentImageIndex: 0,
      fetchInterval: null,
      updateInterval: null,
      newImageAdded: false,
    };
  },
  computed: {
    currentImageUrl() {
      return this.imageUrls[this.currentImageIndex];
    }
  },
  methods: {
    fetchImages() {
      axios.get('http://localhost:8000/images/')
        .then(response => {
          const newImageUrls = response.data.image_urls;

          if (newImageUrls.length > this.imageUrls.length) {
            this.imageUrls = newImageUrls;
            this.currentImageIndex = this.imageUrls.length - newImageUrls.length;
            this.newImageAdded = true;
            
            this.showNextImage();
          } else {
            this.imageUrls = newImageUrls;
          }
        })
        .catch(error => {
          console.error("There was an error fetching the images:", error);
        });
    },
    startImageRotation() {
      this.fetchInterval = setInterval(() => {
        this.showNextImage();
      }, 5000); 
    },
    showNextImage() {
      if (this.newImageAdded) {
        this.newImageAdded = false;
      } else {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.imageUrls.length;
      }
    },
    updateGallery() {
      this.updateInterval = setInterval(() => {
        this.fetchImages(); 
      }, 5000);
    }
  },
  mounted() {
    this.fetchImages();
    this.updateGallery();
    this.startImageRotation();

    this.$nextTick(() => {
      const headerHeight = this.$refs.header.offsetHeight;
      const containerHeight = `calc(100vh - ${headerHeight}px)`;
      this.$refs.imageContainer.style.height = containerHeight;
    });
  },
  beforeUnmount() {
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);  
    }
    if (this.updateInterval) {
      clearInterval(this.updateInterval); 
    }
  }
}
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: 'Roboto', sans-serif; 
  color: white; 
}

.image-gallery {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(to bottom, #111112, #150C20);
}

.gallery-header {
  background-color: #111112; 
  color: white;
  text-align: center;
  font-size: 1.5rem;
  padding: 10px 0;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; 
  font-family: 'Roboto', sans-serif; 
  font-weight: 600;
}

.header-title {
  flex-grow: 1;
  text-align: center;
}

.logo {
  height: 50px; 
  border: none !important; 
  margin: 0 10px; 
  position: absolute;
}

.logo:first-child {
  left: 10px;
}

.logo:last-child {
  right: 10px; 
}

.image-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(to bottom, #111112, #150C20);
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

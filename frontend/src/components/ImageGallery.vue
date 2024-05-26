<template>
  <div class="image-gallery">
    <header ref="header" class="gallery-header">Memes da Galera</header>
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
  font-family: 'Rubik', sans-serif;
  background-color: #343541; 
  color: white; 
}

.image-gallery {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #343541;
}

.gallery-header {
  background-color: #202123; 
  color: white;
  text-align: center;
  font-size: 2rem;
  padding: 10px 0;
  box-sizing: border-box;
  font-family: 'Rubik', sans-serif; 
}

.image-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #343541; 
}

.image-gallery img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: 5px solid #343541; 
}
</style>

<template>
  <div class="upload-form">
    <header class="form-header">
      <div class="header-title">Gerador de Memes</div>
    </header>
    <form @submit.prevent="uploadImage">
      <div class="preview">
        <p v-if="!selectedFile && !uploadedImageUrl">
          Adicione uma imagem aqui para gerar um meme!
        </p>
        <p v-else-if="selectedFile && !uploadedImageUrl">
          Imagem selecionada!
        </p>
        <p v-if="uploadedImageUrl">
          Meme gerado com sucesso!
        </p>
        <div v-if="uploadedImageUrl || imagePreview" class="image-container">
          <img :src="uploadedImageUrl ? uploadedImageUrl : imagePreview" alt="Generated Meme or Preview">
          <div v-if="isProcessing" class="overlay">
            <i class="fas fa-spinner fa-spin"></i> 
          </div>
        </div>
      </div>
      <label :class="[selectedFile ? 'change-image-label' : 'add-image-label']" @click="triggerFileInput($event)">
        <i :class="[selectedFile ? 'fas fa-exchange-alt' : 'fas fa-plus']"></i>
      </label>
      <input type="file" @change="onFileChange" ref="fileInput" style="display: none;"/>
      <button type="submit" :disabled="!selectedFile || isLoading">
        <span v-if="isLoading">Carregando...</span>
        <span v-else>Enviar</span>
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ImageUploadForm',
  data() {
    return {
      selectedFile: null,
      uploadedImageUrl: null,
      isLoading: false,
      isProcessing: false,
      imagePreview: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.uploadedImageUrl = null;
      this.imagePreview = null;
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    },
    async uploadImage() {
      if (!this.selectedFile) return;

      this.isLoading = true;
      this.isProcessing = true;

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const response = await axios.post('https://memegeneratorbackend-production.up.railway.app/generate-meme/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.uploadedImageUrl = response.data.captioned_image_url;
      } catch (error) {
        console.error('Erro ao enviar a imagem:', error);
      } finally {
        this.isLoading = false;
        this.isProcessing = false;
      }
    },
    triggerFileInput(event) {
      event.stopImmediatePropagation();
      this.$refs.fileInput.click();
    }
  },
};
</script>



<style scoped>
.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0; 
  padding: 0;
  background: linear-gradient(to bottom, #08111E, #0C1928, #05264E, #002F6B);
  color: white;
  min-height: 100vh; 
}

.form-header {
  color: white;
  text-align: center;
  font-size: 1.5rem;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 20px;
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

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-image-label {
  width: 150px; 
  height: 200px; 
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #4fd34d00;
  border: 5px , solid, #fff;
  border-radius: 15px; 
  transition: background-color 0.3s, box-shadow 0.3s;
  margin: 20px;
}

.change-image-label {
  width: 50px; 
  height: 50px; 
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #4fd34d00;
  border: 5px , solid, #fff;
  border-radius: 15px; 
  transition: background-color 0.3s, box-shadow 0.3s;
  margin: 20px;
}

.add-image-label i, .change-image-label i {
  font-size: 2rem;
  color: white;
}

button {
  background-color: #4FD34D;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px; 
  font-family: 'Roboto', sans-serif; 
  font-size: 1.1rem;
}

button:disabled {
  background-color: #D63938;
  cursor: not-allowed;
}

p {
  font-family: 'Roboto', sans-serif; 
}

.preview, .result {
  margin-top: 20px;
  text-align: center;
}

.preview img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border: 5px solid #ffffff;
}

.image-container {
  position: relative; /* Makes the overlay positioning relative to this container */
  display: inline-block; /* This will wrap the container around the image */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

.preview img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border: 5px solid #ffffff;
}

</style>

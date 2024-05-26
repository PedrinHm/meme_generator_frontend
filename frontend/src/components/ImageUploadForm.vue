<template>
  <div class="upload-form">
    <header class="form-header">Envie sua Imagem para Gerar um Meme</header>
    <form @submit.prevent="uploadImage">
      <input type="file" @change="onFileChange" />
      <button type="submit" :disabled="!selectedFile || isLoading">
        <span v-if="isLoading">Carregando...</span>
        <span v-else>Enviar</span>
      </button>
    </form>
    <div v-if="uploadedImageUrl" class="result">
      <p>Meme gerado com sucesso!</p>
      <img :src="uploadedImageUrl" alt="Generated Meme" />
    </div>
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
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadImage() {
      if (!this.selectedFile) return;

      this.isLoading = true; 

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const response = await axios.post('http://localhost:8000/generate-meme/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.uploadedImageUrl = response.data.captioned_image_url;
      } catch (error) {
        console.error('Erro ao enviar a imagem:', error);
      } finally {
        this.isLoading = false; 
      }
    },
  },
};
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

.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0; 
  padding: 0;
  background-color: #343541;
  color: white; 
  min-height: 100vh; 
}

.form-header {
  background-color: #202123; 
  color: white;
  text-align: center;
  font-size: 1.5rem;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="file"] {
  margin-bottom: 10px;
}

button {
  background-color: #8cae77;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  text-align: center;
}

.result img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border: 5px solid #343541; 
}
</style>

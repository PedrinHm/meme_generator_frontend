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
        <img v-if="uploadedImageUrl || imagePreview" :src="uploadedImageUrl ? uploadedImageUrl : imagePreview" :alt="uploadedImageUrl ? 'Generated Meme' : 'Preview'" />
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
    triggerFileInput(event) {
      event.stopImmediatePropagation();
      this.$refs.fileInput.click();
    }
  },
};
</script>


<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
  background-color: #111112; 
  color: white; 
}

.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0; 
  padding: 0;
  background-color: #111112; 
  color: white;
  min-height: 100vh; 
}

.form-header {
  background-color: #111112; 
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

@keyframes border-animation {
  0% { border-color: red; }
  25% { border-color: blue; }
  50% { border-color: green; }
  75% { border-color: yellow; }
  100% { border-color: red; }
}

.preview img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border: 5px solid #0C111C;
  animation: border-animation 4s linear infinite;
}
</style>

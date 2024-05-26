<template>
  <div class="upload-form">
    <header class="form-header">
      <div class="header-title">Envie sua Imagem para Gerar um Meme</div>
    </header>
    <form @submit.prevent="uploadImage">
      <div v-if="selectedFile || uploadedImageUrl" class="preview">
        <p v-if="selectedFile && !uploadedImageUrl">Imagem selecionada:</p>
        <p v-if="uploadedImageUrl">Meme gerado com sucesso!</p>
        <img :src="uploadedImageUrl ? uploadedImageUrl : imagePreview" :alt="uploadedImageUrl ? 'Generated Meme' : 'Preview'" />
      </div>
      <label class="file-input-label">
        Anexar Imagem <i class="fas fa-paperclip"></i>
        <input type="file" @change="onFileChange" />
      </label>
      <button type="submit" :disabled="!selectedFile || isLoading">
        <span v-if="isLoading">Carregando...</span>
        <span v-else>Enviar</span>
      </button>
    </form>
    <footer class="site-footer">
      <p>© 2024 Pedro Mendes. Todos os direitos reservados.</p>
      <p>
        <a href="https://www.linkedin.com/in/pedro-mendes-919b51181/">Linkedin</a> |
        <a href="https://github.com/PedrinHm">GitHub</a>
      </p>
    </footer>
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
      this.uploadedImageUrl = null; // Reseta a URL do meme gerado quando uma nova imagem é selecionada
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

      this.isLoading = true; // Inicia o estado de carregamento

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
        this.isLoading = false; // Encerra o estado de carregamento
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
  background-color: #343541; /* Cinza escuro */
  color: white; /* Texto branco */
}

.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0; /* Remover margem superior */
  padding: 0;
  background-color: #343541; /* Fundo cinza escuro */
  color: white; /* Texto branco */
  min-height: 100vh; /* Garantir que o fundo preencha toda a altura da tela */
}

.form-header {
  background-color: #202123; /* Cinza escuro */
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
  position: relative; /* Permitir posicionamento absoluto das logos */
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

.file-input-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 10px;
  font-family: 'Rubik', sans-serif; /* Aplicando a mesma fonte */
}

.file-input-label input {
  display: none;
}

button {
  background-color: #8cae77;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px; /* Bordas arredondadas */
  font-family: 'Rubik', sans-serif; /* Aplicando a mesma fonte */
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.preview, .result {
  margin-top: 20px;
  text-align: center;
}

.preview img, .result img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border: 5px solid #343541; /* Bordas cinza escuro */
}

.site-footer {
  background-color: #202123; /* Cinza escuro */
  color: #ccc; /* Cor do texto do rodapé */
  text-align: center;
  padding: 20px;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.site-footer p {
  margin: 5px 0;
}

.site-footer a {
  color: #8cae77; /* Cor dos links do rodapé */
  text-decoration: none;
  margin: 0 10px;
}

.site-footer a:hover {
  text-decoration: underline;
}
</style>

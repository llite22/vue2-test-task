<template>
  <v-container>
    <v-file-input label="Выберите файл" v-model="file" />
    <v-btn color="primary" @click="uploadFile" :disabled="!file">
      Отправить
    </v-btn>
    <v-btn v-if="uploadedFileUrl" color="success" @click="downloadFile">
      Скачать
    </v-btn>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      file: null,
      uploadedFileUrl: null,
    };
  },
  methods: {
    async uploadFile() {
      const formData = new FormData();
      formData.append("file", this.file);

      try {
        const response = await axios.post(
          "https://api.escuelajs.co/api/v1/files/upload",
          formData
        );
        this.uploadedFileUrl = response.data.location;
        this.$toast.success("Файл успешно загружен");
      } catch {
        this.$toast.error("Ошибка загрузки файла");
      }
    },
    downloadFile() {
      window.open(this.uploadedFileUrl, "_blank");
    },
  },
};
</script>

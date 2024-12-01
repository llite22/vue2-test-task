<template>
  <v-container>
    <v-toolbar flat>
      <v-btn color="primary" @click="openDrawer('add')">Добавить пост</v-btn>
    </v-toolbar>
    <v-data-table :headers="[
      ...headers,
    ]" :items="posts" :footer-props="{ 'items-per-page-options': [] }" hide-default-footer @click:row="editPost">
      <template #[`item.actions`]="{ item }">
        <v-btn small color="error" @click.stop="confirmDeletePost(item)">
          Удалить
        </v-btn>
      </template>
    </v-data-table>
    <div v-if="posts && posts.length">
      <v-pagination v-model="page" :length="totalPages" :total-visible="7" @input="fetchPosts"
        prev-icon="mdi-chevron-left" next-icon="mdi-chevron-right">
      </v-pagination>
    </div>

    <v-dialog v-model="deleteConfirmDialog" max-width="240">
      <v-card>
        <v-card-title class="headline">Подтверждение удаления</v-card-title>
        <v-card-text>Вы уверены, что хотите удалить этот пост?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteConfirmDialog = false">
            Отмена
          </v-btn>
          <v-btn color="red darken-1" text @click="deletePost">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-navigation-drawer v-model="drawer" left persistent>
      <v-card>
        <v-card-title>{{ drawerMode === "edit" ? "Редактировать пост" : "Добавить пост" }}</v-card-title>
        <v-card-text>
          <v-text-field label="Title" v-model="currentPost.title" />
          <v-textarea label="Body" v-model="currentPost.body" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="savePost">Сохранить</v-btn>
          <v-btn text @click="closeDrawer">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      drawer: false,
      drawerMode: "add",
      currentPost: { id: null, title: "", body: "" },
      posts: [],
      deleteConfirmDialog: false,
      postToDelete: null,
      headers: [
        { text: "ID", value: "id", width: '80px' },
        { text: "Заголовок", value: "title" },
        { text: "Содержимое", value: "body" },
        { text: 'Действия', value: 'actions', sortable: false },
      ],
      page: 1,
      itemsPerPage: 6,
      totalPages: 0,
    };
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts",
          {
            params: {
              _page: this.page,
              _limit: this.itemsPerPage
            }
          }
        );
        this.posts = response.data;
        this.totalPages = Math.ceil(response.headers['x-total-count'] / this.itemsPerPage);
      } catch {
        this.$toast.error("Не удалось загрузить посты");
      }
    },
    openDrawer(mode, post = { id: null, title: "", body: "" }) {
      this.drawerMode = mode;
      this.currentPost = { ...post };
      this.drawer = true;
    },
    closeDrawer() {
      this.drawer = false;
    },
    async savePost() {
      try {
        if (this.drawerMode === "edit") {
          // Обновить пост
          await axios.put(
            `https://jsonplaceholder.typicode.com/posts/${this.currentPost.id}`,
            this.currentPost
          );
          this.posts = this.posts.map((post) =>
            post.id === this.currentPost.id ? this.currentPost : post
          );
          this.$toast.success("Пост успешно обновлён");
          this.closeDrawer();
        } else {
          // Добавить новый пост
          const response = await axios.post(
            "https://jsonplaceholder.typicode.com/posts",
            this.currentPost
          );
          this.posts.push(response.data);
          this.$toast.success("Пост успешно добавлен");
          this.closeDrawer();
        }
      } catch {
        this.$toast.error("Ошибка при сохранении поста");
      }
    },
    editPost(post) {
      this.openDrawer("edit", post);
    },
    confirmDeletePost(post) {
      this.postToDelete = post;
      this.deleteConfirmDialog = true;
    },
    async deletePost() {
      if (this.postToDelete) {
        try {
          await axios.delete(
            `https://jsonplaceholder.typicode.com/posts/${this.postToDelete.id}`
          );
          this.posts = this.posts.filter((p) => p.id !== this.postToDelete.id);
          this.deleteConfirmDialog = false;
          this.$toast.success("Пост успешно удалён");
          this.postToDelete = null;
        } catch {
          this.$toast.error("Ошибка при удалении поста");
          this.deleteConfirmDialog = false;
        }
      }
    },
  },
  mounted() {
    this.fetchPosts();
  },
};
</script>
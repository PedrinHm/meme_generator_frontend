import { createRouter, createWebHistory } from 'vue-router';
import UploadView from '../views/UploadView.vue';
import GalleryView from '../views/GalleryView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/upload'
  },
  {
    path: '/upload',
    name: 'Upload',
    component: UploadView
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: GalleryView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;

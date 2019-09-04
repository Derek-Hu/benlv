import axios from 'axios';

const getToken = () => {
  return sessionStorage.getItem('token');
};

const instance = axios.create({
  baseURL: '/',
  headers: { Authorization: getToken() }
});

// Add a response interceptor
instance.interceptors.response.use(function(response) {
  return response.data;
});
// 发送请求
export function getArticleList() {
  return instance.get(`/docs/metadatas.json`);
}

export function getArticleById(path) {
  return instance.get(`/docs/${path}`);
}

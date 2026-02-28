import axios from 'axios';
import { navigateTo } from "../utils/navigation";

const API_BASE_URL_AUTH = (import.meta as any).env.VITE_API_BASE_URL_AUTH  ;
const API_BASE_URL_VIDEO = (import.meta as any).env.VITE_API_BASE_URL_VIDEO ;

const api_auth = axios.create({
  baseURL: API_BASE_URL_AUTH,
  withCredentials: true,
});

const api_video = axios.create({
  baseURL: API_BASE_URL_VIDEO,
  withCredentials: true,
});


api_video.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 ||
        (error.response?.status === 403 &&
          (error.response?.data?.detail ===
            "Authentication credentials were not provided." ||
            error.response?.data?.detail === "Invalid or expired token" || error.response?.data?.detail === "User not found"))) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api_auth.post("/api/v1/auth/refresh/");
        return api_video(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user_id");

        navigateTo("/login");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

api_auth.interceptors.request.use(
  (config) => {
     
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

 
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  login: async (credentials: any) => {
    await mockDelay(1000);
    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      const user = { id: '1', name: 'John Doe', email: 'user@example.com' };
      const token = 'mock-jwt-token';
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { data: { user, token } };
    }
    throw new Error('Invalid email or password');
  },
  register: async (userData: any) => {
    await mockDelay(1000);
    return { data: { message: 'Registration successful' } };
  },
  getVideos: async () => {
    await mockDelay(800);
    const storedVideos = JSON.parse(localStorage.getItem('videos') || '[]');
    // Default mock videos if empty
    if (storedVideos.length === 0) {
      const defaultVideos = [
        {
          id: '1',
          title: 'Exploring the Mountains',
          description: 'A beautiful journey through the Alps.',
          thumbnail: 'https://picsum.photos/seed/mountains/400/225',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          author: 'Nature Lover',
          views: '1.2M',
          createdAt: '2 days ago'
        },
        {
          id: '2',
          title: 'Urban City Lights',
          description: 'The vibrant life of Tokyo at night.',
          thumbnail: 'https://picsum.photos/seed/city/400/225',
          videoUrl: 'https://www.w3schools.com/html/movie.mp4',
          author: 'City Explorer',
          views: '850K',
          createdAt: '5 hours ago'
        },
        {
          id: '3',
          title: 'Cooking Masterclass',
          description: 'Learn to cook the perfect steak.',
          thumbnail: 'https://picsum.photos/seed/cooking/400/225',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          author: 'Chef Gordon',
          views: '3.4M',
          createdAt: '1 week ago'
        }
      ];
      return { data: defaultVideos };
    }
    return { data: storedVideos };
  },
  uploadVideo: async (videoData: any, onProgress: (progress: number) => void) => {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      onProgress(i);
      await mockDelay(200);
    }
    
    const newVideo = {
      id: Math.random().toString(36).substr(2, 9),
      ...videoData,
      thumbnail: `https://picsum.photos/seed/${Math.random()}/400/225`,
      views: '0',
      createdAt: 'Just now',
      author: JSON.parse(localStorage.getItem('user') || '{}').name || 'Anonymous'
    };

    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    videos.unshift(newVideo);
    localStorage.setItem('videos', JSON.stringify(videos));

    return { data: newVideo };
  }
};

export { api_auth, api_video };

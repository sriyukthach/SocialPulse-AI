import axios from 'axios';
import { Brand, Post, BrandDashboardStats, EngagementAnalysisResponse, RecalledMemoryItem } from '../types';

const API_BASE = '/api';

export const api = {
  // Brands
  getBrands: async (): Promise<Brand[]> => {
    const res = await axios.get(`${API_BASE}/brands`);
    return res.data;
  },

  getBrandDashboard: async (brandId: number): Promise<BrandDashboardStats> => {
    const res = await axios.get(`${API_BASE}/brands/${brandId}/dashboard`);
    return res.data;
  },

  createBrand: async (brandData: Omit<Brand, 'id' | 'created_at'>): Promise<Brand> => {
    const res = await axios.post(`${API_BASE}/brands`, brandData);
    return res.data;
  },

  // Posts
  getPosts: async (brandId?: number): Promise<Post[]> => {
    const params = brandId ? { brand_id: brandId } : {};
    const res = await axios.get(`${API_BASE}/posts`, { params });
    return res.data;
  },

  createPost: async (postData: {
    brand_id: number;
    topic: string;
    format: string;
    caption: string;
    likes: number;
    comments_count: number;
    shares_count: number;
    audience_feedback?: string;
    posted_date?: string;
  }): Promise<Post> => {
    const res = await axios.post(`${API_BASE}/posts`, postData);
    return res.data;
  },

  // Memories (Hindsight)
  getMemories: async (brandId: number, query: string = "audience preferences feedback formats engagement"): Promise<RecalledMemoryItem[]> => {
    const res = await axios.get(`${API_BASE}/memories/${brandId}`, { params: { query } });
    return res.data;
  },

  retainInsight: async (brandId: number, insightText: string, context?: string): Promise<{ success: boolean; bank_id: string }> => {
    const res = await axios.post(`${API_BASE}/memories/retain`, {
      brand_id: brandId,
      insight_text: insightText,
      context: context || "Manual audience observation entry"
    });
    return res.data;
  },

  reflectMemories: async (brandId: number, query: string): Promise<{ bank_id: string; reflection: string }> => {
    const res = await axios.post(`${API_BASE}/memories/reflect`, {
      brand_id: brandId,
      query
    });
    return res.data;
  },

  // Engagement Intelligence Analysis
  getEngagementAnalysis: async (brandId: number, focusQuery?: string): Promise<EngagementAnalysisResponse> => {
    const res = await axios.post(`${API_BASE}/analysis/generate`, {
      brand_id: brandId,
      focus_query: focusQuery || undefined
    });
    return res.data;
  },

  // Demo Seeding
  seedDemo: async (): Promise<{ success: boolean; message: string; brands: any[] }> => {
    const res = await axios.post(`${API_BASE}/demo/seed`);
    return res.data;
  }
};

// File: services/apiService.ts (Harmonized with server endpoints)
import { API_BASE_URL } from '../config/constants';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface VerifyTokenResponse {
    success: boolean;
    valid: boolean;
    user_info?: {
        uid: string;
        email: string;
        email_verified: boolean;
    };
    has_profile: boolean;
    profile?: any;
    error?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user_id: string;
    profile?: any;
}

export interface UserRegistrationData {
    firebase_token: string;
    parent: {
        name: string;
        email: string;
        phone_number?: string;
    };
    child: {
        name: string;
        age: number;
        interests: string[];
    };
    system_prompt?: string;
}

export interface UserProfileUpdateData {
    firebase_token: string;
    parent?: {
        name: string;
        email: string;
        phone_number?: string;
    };
    child?: {
        name: string;
        age: number;
        interests: string[];
    };
    system_prompt?: string;
}

export interface StoryGenerationData {
    firebase_token: string;
    prompt: string;
}

export interface SystemPromptUpdateData {
    firebase_token: string;
    system_prompt: string;
}

export interface StoryManifest {
    story_id: string;
    title: string;
    total_duration: number;
    segments: Array<{
        type: 'audio' | 'image';
        url: string;
        start: number;
    }>;
}

class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        };

        try {
            console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

            const response = await fetch(url, {
                ...options,
                headers: defaultHeaders,
            });

            console.log(`📡 Response Status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { detail: `HTTP error! status: ${response.status}` };
                }

                const errorMessage = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
                console.error(`❌ API Error:`, errorMessage);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log(`✅ API Success:`, data);
            return data;
        } catch (error) {
            console.error(`🚨 API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Auth endpoints - Updated to match server format
    async verifyToken(token: string): Promise<VerifyTokenResponse> {
        return this.makeRequest<VerifyTokenResponse>('/auth/verify-token', {
            method: 'POST',
            body: JSON.stringify(token), // Server expects just the token string
        });
    }

    async registerUser(data: UserRegistrationData): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getUserProfile(token: string): Promise<{ success: boolean; user_id: string; profile: any }> {
        return this.makeRequest(`/auth/profile/${token}`, {
            method: 'GET',
        });
    }

    async updateUserProfile(data: UserProfileUpdateData): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteUserProfile(token: string): Promise<{ success: boolean; message: string; user_id: string }> {
        return this.makeRequest(`/auth/profile/${token}`, {
            method: 'DELETE',
        });
    }

    // Story endpoints - Updated to match server format
    async generateStory(data: StoryGenerationData): Promise<StoryManifest> {
        return this.makeRequest<StoryManifest>('/stories/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getUserStories(token: string): Promise<{ stories: any[] }> {
        return this.makeRequest(`/stories/${token}`, {
            method: 'GET',
        });
    }

    async updateSystemPrompt(data: SystemPromptUpdateData): Promise<{ success: boolean; message: string; user_id: string }> {
        return this.makeRequest('/stories/system-prompt', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Health check
    async healthCheck(): Promise<any> {
        return this.makeRequest('/health', {
            method: 'GET',
        });
    }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;
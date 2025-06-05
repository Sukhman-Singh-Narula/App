// File: services/apiService.ts
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
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers: defaultHeaders,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Auth endpoints
    async verifyToken(token: string): Promise<VerifyTokenResponse> {
        return this.makeRequest<VerifyTokenResponse>('/auth/verify-token', {
            method: 'POST',
            body: JSON.stringify({ firebase_token: token }),
        });
    }

    async registerUser(data: UserRegistrationData): Promise<any> {
        return this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getUserProfile(token: string): Promise<any> {
        return this.makeRequest(`/auth/profile/${token}`, {
            method: 'GET',
        });
    }

    async updateUserProfile(data: UserProfileUpdateData): Promise<any> {
        return this.makeRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteUserProfile(token: string): Promise<any> {
        return this.makeRequest(`/auth/profile/${token}`, {
            method: 'DELETE',
        });
    }

    // Story endpoints
    async generateStory(data: StoryGenerationData): Promise<any> {
        return this.makeRequest('/generate-story', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getUserStories(token: string): Promise<any> {
        return this.makeRequest(`/stories/${token}`, {
            method: 'GET',
        });
    }

    async updateSystemPrompt(data: SystemPromptUpdateData): Promise<any> {
        return this.makeRequest('/system-prompt', {
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
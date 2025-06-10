// File: services/apiService.ts - Enhanced debugging version
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
            console.log('📦 Request Headers:', defaultHeaders);

            if (options.body) {
                console.log('📦 Request Body (raw):', options.body);
                console.log('📦 Request Body (type):', typeof options.body);
                console.log('📦 Request Body (length):', options.body.length);

                // Try to parse and log the JSON
                try {
                    const parsedBody = JSON.parse(options.body as string);
                    console.log('📦 Request Body (parsed):', parsedBody);
                } catch (e) {
                    console.log('📦 Request Body (not JSON):', options.body);
                }
            } else {
                console.log('📦 No request body');
            }

            const response = await fetch(url, {
                ...options,
                headers: defaultHeaders,
            });

            console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
            console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));

            const responseText = await response.text();
            console.log('📡 Response Body (raw):', responseText);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = JSON.parse(responseText);
                    console.log('📄 Error Response Body (parsed):', errorData);
                } catch {
                    errorData = { detail: responseText || `HTTP error! status: ${response.status}` };
                }

                const errorMessage = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
                console.error(`❌ API Error:`, errorMessage);
                throw new Error(errorMessage);
            }

            const data = JSON.parse(responseText);
            console.log(`✅ API Success:`, data);
            return data;
        } catch (error) {
            console.error(`🚨 API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Auth endpoints - Enhanced debugging for token verification
    async verifyToken(token: string): Promise<VerifyTokenResponse> {
        console.log('🔍 apiService.verifyToken: Method called');
        console.log('🔍 apiService.verifyToken: Token provided:', token ? 'YES' : 'NO');
        console.log('🔍 apiService.verifyToken: Token length:', token?.length || 0);
        console.log('🔍 apiService.verifyToken: Token (first 20 chars):', token?.substring(0, 20) + '...');

        const requestBody = {
            firebase_token: token
        };

        console.log('🔍 apiService.verifyToken: Creating request body:', requestBody);
        const jsonBody = JSON.stringify(requestBody);
        console.log('🔍 apiService.verifyToken: JSON body:', jsonBody);
        console.log('🔍 apiService.verifyToken: About to call makeRequest...');

        try {
            const result = await this.makeRequest<VerifyTokenResponse>('/auth/verify-token', {
                method: 'POST',
                body: jsonBody,
            });

            console.log('✅ apiService.verifyToken: Success:', result);
            return result;
        } catch (error) {
            console.error('❌ apiService.verifyToken: Error:', error);
            console.error('❌ apiService.verifyToken: Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            throw error;
        }
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

    // DEBUG METHODS - Add these for testing
    async testSimple(): Promise<any> {
        return this.makeRequest('/auth/test-simple', {
            method: 'POST',
        });
    }

    async testEcho(token: string): Promise<any> {
        const requestBody = {
            firebase_token: token
        };

        return this.makeRequest('/auth/test-echo', {
            method: 'POST',
            body: JSON.stringify(requestBody),
        });
    }

    async verifyTokenRaw(token: string): Promise<any> {
        const requestBody = {
            firebase_token: token
        };

        return this.makeRequest('/auth/verify-token-debug', {
            method: 'POST',
            body: JSON.stringify(requestBody),
        });
    }
}


export const apiService = new ApiService(API_BASE_URL);
export default apiService;
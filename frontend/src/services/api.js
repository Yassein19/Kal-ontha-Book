/**
 * API Service for Kal Ontha Platform
 * Manages JWT tokens, device fingerprinting, and API requests.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

/**
 * Computes or retrieves a persistent unique device fingerprint
 */
export function getDeviceFingerprint() {
  let deviceId = localStorage.getItem('kal_ontha_device_id');
  if (!deviceId) {
    const raw = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      Math.random().toString(36).substring(2, 15),
    ].join('###');

    // Simple hash
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    deviceId = 'dev_' + Math.abs(hash).toString(16) + '_' + Date.now().toString(36);
    localStorage.setItem('kal_ontha_device_id', deviceId);
  }
  return deviceId;
}

/**
 * Universal request wrapper with auth & device token headers
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('kal_ontha_token');
  const deviceToken = getDeviceFingerprint();

  const headers = {
    'Content-Type': 'application/json',
    'x-device-token': deviceToken,
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    const error = new Error('تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت أو تشغيل الخادم.');
    error.code = 'NETWORK_ERROR';
    error.status = 0;
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'حدث خطأ في الاتصال بالخادم');
    error.status = response.status;
    error.code = data.error;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    async login(email, password) {
      const deviceToken = getDeviceFingerprint();
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, deviceToken }),
      });
      if (res.token) {
        localStorage.setItem('kal_ontha_token', res.token);
        localStorage.setItem('kal_ontha_user', JSON.stringify(res.user));
      }
      return res;
    },

    async me() {
      return request('/auth/me');
    },

    logout() {
      localStorage.removeItem('kal_ontha_token');
      localStorage.removeItem('kal_ontha_user');
    },

    getUser() {
      try {
        const stored = localStorage.getItem('kal_ontha_user');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    },

    isAuthenticated() {
      return !!localStorage.getItem('kal_ontha_token');
    },

    async resetDeviceLock(userId) {
      return request('/auth/reset-device-lock', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    },
  },

  reader: {
    async getBookMeta(bookId = 1) {
      return request(`/reader/book/${bookId}/meta`);
    },

    async getPageTicket(bookId, pageNumber) {
      return request(`/reader/page-ticket/${bookId}/${pageNumber}`);
    },

    getStreamUrl(streamPath) {
      return `${API_BASE_URL.replace('/api', '')}${streamPath}`;
    },
  },

  contact: {
    async submit(payload) {
      return request('/contact', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  admin: {
    async createReader(payload) {
      return request('/admin/readers', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async listReaders() {
      return request('/admin/readers');
    },

    async resetReaderLock(readerId) {
      return request(`/admin/readers/${readerId}/reset-lock`, {
        method: 'POST',
      });
    },

    async deleteReader(readerId) {
      return request(`/admin/readers/${readerId}`, {
        method: 'DELETE',
      });
    },
  },
};

export default api;

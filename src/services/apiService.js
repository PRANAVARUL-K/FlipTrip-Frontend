// services/apiService.js - Complete API service for all endpoints
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_TOUR_PACKAGE_BACKEND_URL;
  }

  // ==================== Cookie Management ====================
  setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  clearAuthCookies() {
    this.deleteCookie('sessionKey');
    this.deleteCookie('userEmail');
    this.deleteCookie('isLoggedIn');
    this.deleteCookie('userId');
    this.deleteCookie('userName');
    this.deleteCookie('sessionExpiry');
  }

  // ==================== Session Management ====================
  getSessionKey() {
    return this.getCookie('sessionKey');
  }

  storeAuthData(authData, rememberMe = false) {
    const cookieExpiry = rememberMe ? 30 : 7;
    
    this.setCookie('sessionKey', authData.session_key, cookieExpiry);
    this.setCookie('userEmail', authData.user.email, cookieExpiry);
    this.setCookie('isLoggedIn', 'true', cookieExpiry);
    this.setCookie('userId', authData.user.user_id, cookieExpiry);
    this.setCookie('userName', `${authData.user.first_name} ${authData.user.last_name}`, cookieExpiry);
    this.setCookie('sessionExpiry', authData.expires_at, cookieExpiry);
    
    if (rememberMe) {
      this.setCookie('rememberMe', 'true', cookieExpiry);
    }
  }

  isAuthenticated() {
    const sessionKey = this.getSessionKey();
    const isLoggedIn = this.getCookie('isLoggedIn');
    const sessionExpiry = this.getCookie('sessionExpiry');
    
    if (!sessionKey || !isLoggedIn) {
      return false;
    }

    if (sessionExpiry) {
      const expiryDate = new Date(sessionExpiry);
      if (new Date() > expiryDate) {
        this.clearAuthCookies();
        return false;
      }
    }

    return true;
  }

  getCurrentUser() {
    if (!this.isAuthenticated()) {
      return null;
    }

    return {
      userId: this.getCookie('userId'),
      email: this.getCookie('userEmail'),
      name: this.getCookie('userName'),
      sessionExpiry: this.getCookie('sessionExpiry')
    };
  }

  // ==================== HTTP Request Handler ====================
  getDefaultHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    const sessionKey = this.getSessionKey();
    if (sessionKey) {
      headers['X-Session-Key'] = sessionKey;
    }

    return headers;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}/trip_package${endpoint}`;
    
    const config = {
      headers: {
        ...this.getDefaultHeaders(),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle authentication errors
      if (response.status === 401) {
        this.clearAuthCookies();
        
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // ==================== Authentication APIs (No session key required) ====================
  
  /**
   * Register a new user
   * @param {Object} userData - {first_name, last_name, email, phone_number, password, remember_me}
   * @returns {Promise} API response
   */
  async registerUser(userData) {
    return this.makeRequest('/register_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  }

  /**
   * Login user
   * @param {Object} credentials - {email, password, remember_me}
   * @returns {Promise} API response
   */
  async loginUser(credentials) {
    return this.makeRequest('/login_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  }

  // ==================== Protected APIs (Require session key) ====================
  
  /**
   * Filter travel packages
   * @param {Object} filters - {budget, start_date, starting_place, head_count}
   * @returns {Promise} API response with filtered packages
   */
  async filterPackage(filters) {
    return this.makeRequest('/filter_package', {
      method: 'POST',
      body: JSON.stringify(filters)
    });
  }

  /**
   * Get flight options for start journey
   * @param {Object} flightData - Flight search parameters
   * @returns {Promise} API response with flight options
   */
  async getStartFlightOptions(flightData) {
    return this.makeRequest('/start_flight_options', {
      method: 'POST',
      body: JSON.stringify(flightData)
    });
  }

  /**
   * Generate complete flight plan
   * @param {Object} planData - Flight plan parameters
   * @returns {Promise} API response with flight plan
   */
  async generateFlightPlan(planData) {
    return this.makeRequest('/generate_flight_plan', {
      method: 'POST',
      body: JSON.stringify(planData)
    });
  }

  /**
   * Get flight options for return journey
   * @param {Object} flightData - Return flight search parameters
   * @returns {Promise} API response with return flight options
   */
  async getEndFlightOptions(flightData) {
    return this.makeRequest('/end_flight_options', {
      method: 'POST',
      body: JSON.stringify(flightData)
    });
  }

  /**
   * Create a booking
   * @param {Object} bookingData - Booking details
   * @returns {Promise} API response with booking confirmation
   */
  async createBooking(bookingData) {
    return this.makeRequest('/create_booking', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  }

  /**
   * Get current user details
   * @returns {Promise} API response with user details
   */
  async getUserDetails() {
    return this.makeRequest('/get_user_details', {
      method: 'GET'
    });
  }

  /**
   * Update user details
   * @param {Object} userData - Updated user data
   * @returns {Promise} API response
   */
  async updateUserDetails(userData) {
    return this.makeRequest('/update_user_details', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  /**
   * Change user password
   * @param {Object} passwordData - {current_password, new_password}
   * @returns {Promise} API response
   */
  async changePassword(passwordData) {
    return this.makeRequest('/change_password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }

  /**
   * Extend current session
   * @param {number} days - Number of days to extend (default: 7)
   * @returns {Promise} API response
   */
  async extendSession(days = 7) {
    return this.makeRequest('/extend_session', {
      method: 'POST',
      body: JSON.stringify({ days })
    });
  }

  /**
   * Get user bookings
   * @param {number} userId - User ID (optional, uses current user if not provided)
   * @returns {Promise} API response with user bookings
   */
  async getUserBookings(userId = null) {
    const currentUser = this.getCurrentUser();
    const targetUserId = userId || currentUser?.userId;
    
    if (!targetUserId) {
      throw new Error('User ID is required');
    }

    return this.makeRequest(`/view_bookings/${targetUserId}/`, {
      method: 'GET'
    });
  }

  /**
   * Fetch ticket details
   * @param {Object} ticketData - Ticket search parameters
   * @returns {Promise} API response with ticket details
   */
  async fetchTicketDetails(ticketData) {
    return this.makeRequest('/fetch_ticket_details', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  }

  /**
   * Logout user (if you implement this endpoint)
   * @returns {Promise} API response
   */
  async logoutUser() {
    try {
      const result = await this.makeRequest('/logout_user', {
        method: 'POST'
      });
      
      this.clearAuthCookies();
      return result;
    } catch (error) {
      this.clearAuthCookies();
      throw error;
    }
  }

  // ==================== Convenience Methods ====================
  
  /**
   * Generic GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.makeRequest(url, {
      method: 'GET'
    });
  }

  /**
   * Generic POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @returns {Promise} API response
   */
  async post(endpoint, data) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Generic PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @returns {Promise} API response
   */
  async put(endpoint, data) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Generic DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} API response
   */
  async delete(endpoint) {
    return this.makeRequest(endpoint, {
      method: 'DELETE'
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

// Export individual API functions for easier imports
export const authAPI = {
  register: (userData) => apiService.registerUser(userData),
  login: (credentials) => apiService.loginUser(credentials),
  logout: () => apiService.logoutUser(),
  isAuthenticated: () => apiService.isAuthenticated(),
  getCurrentUser: () => apiService.getCurrentUser(),
};

export const packageAPI = {
  filter: (filters) => apiService.filterPackage(filters),
  getStartFlights: (flightData) => apiService.getStartFlightOptions(flightData),
  generatePlan: (planData) => apiService.generateFlightPlan(planData),
  getEndFlights: (flightData) => apiService.getEndFlightOptions(flightData),
};

export const bookingAPI = {
  create: (bookingData) => apiService.createBooking(bookingData),
  getUserBookings: (userId) => apiService.getUserBookings(userId),
  getTicketDetails: (ticketData) => apiService.fetchTicketDetails(ticketData),
};

export const userAPI = {
  getDetails: () => apiService.getUserDetails(),
  updateDetails: (userData) => apiService.updateUserDetails(userData),
  changePassword: (passwordData) => apiService.changePassword(passwordData),
  extendSession: (days) => apiService.extendSession(days),
};

export default apiService;
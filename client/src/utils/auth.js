import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    const token = this.getToken();
    console.log('Token:', token);

    if (token) {
      try {
        const decoded = decode(token);
        console.log('Decoded User:', decoded);
        return decoded;
      } catch (err) {
        console.error('Error decoding token:', err);
        return null;
      }
    }
    return null;
  }

  getUserId() {
    const token = this.getToken();
    if (token) {
      const decodedToken = decode(token);
      return decodedToken?.data?._id || null;
    }
    return null;
  }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    const decoded = decode(token);
    return decoded.exp < Date.now() / 1000;
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.reload();
  }
}

export default new AuthService();
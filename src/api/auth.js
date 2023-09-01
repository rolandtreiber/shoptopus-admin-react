const users = [
  {
    id: '5e86809283e28b96d2d38537',
    avatar: '/static/user-chen_simmons.png',
    email: 'demo@devias.io',
    name: 'Chen Simmons',
    password: 'Password123!'
  }
];

class AuthApi {

  async login({ email, password }) {
    const response = await callLoginApi({email, password})

    return new Promise((resolve, reject) => {
      if (response.access_token) {
        resolve(response.access_token);
      } else {
        reject(new Error('Invalid Credentials'));
      }
    });
  }

  me(accessToken) {
    return new Promise((resolve, reject) => {
      try {
        // Decode access token
        const { userId } = decode(accessToken);

        // Find the user
        const user = users.find((_user) => _user.id === userId);

        if (!user) {
          reject(new Error('Invalid authorization token'));
          return;
        }

        resolve({
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          name: user.name
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();

const AuthService = require('../services/AuthService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    // Expose token both as 'token' (frontend key) and 'accessToken' (RFC naming)
    res.json({ ...result, token: result.accessToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refresh(refreshToken);
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const result = await AuthService.signup(req.body);
    res.status(201).json({ ...result, token: result.accessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { userId } = req.body;
    await AuthService.logout(userId);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

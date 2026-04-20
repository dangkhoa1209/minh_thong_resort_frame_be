const { login } = require("./auth.service");

async function loginController(req, res, next) {
  try {
    const result = await login(req.body.email, req.body.password);
    if (!result) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Email or password is incorrect" },
      });
    }

    return res.json({
      success: true,
      data: {
        access_token: result.accessToken,
        token_type: "Bearer",
        expires_in: 86400,
        user: result.user,
      },
      message: "Dang nhap thanh cong",
    });
  } catch (error) {
    return next(error);
  }
}

async function meController(req, res) {
  return res.json({
    success: true,
    data: {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role,
      is_active: true,
    },
    message: "OK",
  });
}

module.exports = { loginController, meController };

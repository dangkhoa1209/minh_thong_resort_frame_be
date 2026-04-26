const {
  login,
  changePassword,
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
} = require("./auth.service");
const { AdminUser } = require("./auth.model");
const { normalizeRole } = require("../../middleware/auth.middleware");

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
  const user = await AdminUser.findById(req.user.sub)
    .select("email role is_active")
    .lean();

  if (!user) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "User not found" },
    });
  }

  return res.json({
    success: true,
    data: {
      id: req.user.sub,
      email: user.email,
      role: normalizeRole(user.role),
      is_active: Boolean(user.is_active),
    },
    message: "OK",
  });
}

async function changePasswordController(req, res, next) {
  try {
    const result = await changePassword(
      req.user.sub,
      req.body.current_password,
      req.body.new_password
    );

    if (!result.ok && result.reason === "INVALID_CURRENT_PASSWORD") {
      return res.status(422).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Current password is incorrect" },
      });
    }

    if (!result.ok) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      });
    }

    return res.json({
      success: true,
      data: { updated: true },
      message: "Password changed successfully",
    });
  } catch (error) {
    return next(error);
  }
}

async function listUsersController(req, res, next) {
  try {
    const data = await listAdminUsers(req.query);
    return res.json({ success: true, data, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function createUserController(req, res, next) {
  try {
    const result = await createAdminUser(req.body);
    if (!result.ok && result.reason === "EMAIL_EXISTS") {
      return res.status(409).json({
        success: false,
        error: { code: "CONFLICT", message: "Email already exists" },
      });
    }
    return res.status(201).json({
      success: true,
      data: result.user,
      message: "User created successfully",
    });
  } catch (error) {
    return next(error);
  }
}

async function updateUserController(req, res, next) {
  try {
    const result = await updateAdminUser(req.params.id, req.body, req.user.sub);
    if (!result.ok) {
      if (result.reason === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: "User not found" },
        });
      }
      if (result.reason === "LAST_OWNER") {
        return res.status(422).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "At least one active owner must remain" },
        });
      }
      if (result.reason === "SELF_DEACTIVATE") {
        return res.status(422).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "You cannot deactivate your own account" },
        });
      }
      if (result.reason === "SELF_DOWNGRADE") {
        return res.status(422).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "You cannot downgrade your own role" },
        });
      }
    }

    return res.json({
      success: true,
      data: result.user,
      message: "User updated successfully",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  loginController,
  meController,
  changePasswordController,
  listUsersController,
  createUserController,
  updateUserController,
};

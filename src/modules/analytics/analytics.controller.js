const Joi = require("joi");
const { trackProjectView } = require("./analytics.service");

const projectViewSchema = Joi.object({
  project_slug: Joi.string().pattern(/^[a-z0-9-]+$/).required(),
  path: Joi.string().allow("").default(""),
});

async function trackProjectViewController(req, res, next) {
  try {
    const { error, value } = projectViewSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      return res.status(422).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Payload khong hop le" },
      });
    }

    await trackProjectView(value, req);
    return res.json({ success: true, data: {}, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

module.exports = { trackProjectViewController };

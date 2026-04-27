const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const { getEnv } = require('./src/config/env');
const { connectDatabase } = require('./src/config/database');
const { notFoundHandler, errorHandler } = require('./src/middleware/error.middleware');
const mailRoutes = require('./routes/mailRoutes');
const authRoutes = require('./src/modules/auth/auth.routes');
const projectRoutes = require('./src/modules/projects/project.routes');
const homeHighlightRoutes = require("./src/modules/showcase/home-highlight.routes");
const heroSlideRoutes = require("./src/modules/showcase/hero-slide.routes");
const contactSubmissionRoutes = require("./src/modules/contacts/contact-submission.routes");
const dashboardRoutes = require("./src/modules/dashboard/dashboard.routes");
const mediaRoutes = require('./src/modules/media/media.routes');
const publicHomeRoutes = require('./src/modules/public/home.routes');
const { adminSettingRouter, publicSettingRouter } = require('./src/modules/settings/setting.routes');

const app = express();
const env = getEnv();

// Middleware
app.use(
  helmet({
    // Allow FE on a different local origin (127.0.0.1:5501 / localhost:5173)
    // to render uploaded images from this API domain.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/mail', mailRoutes);
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/projects', projectRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/home-highlights", homeHighlightRoutes);
app.use("/api/admin/hero-slides", heroSlideRoutes);
app.use("/api/admin/contacts", contactSubmissionRoutes);
app.use('/api/admin/settings', adminSettingRouter);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/public', publicHomeRoutes);
app.use('/api/public/settings', publicSettingRouter);
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
connectDatabase(env.mongoUri)
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server dang chay tai http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

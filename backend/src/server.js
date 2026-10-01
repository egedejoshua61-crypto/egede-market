import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import { authMiddleware, requireRole } from './middleware/authMiddleware.js';
import { registerUser, loginUser, getCurrentUser, logoutUser, requestPasswordReset, resetPassword } from './controllers/authController.js';
import { createListing, getListingById, getSellerListings, searchListings } from './controllers/listingController.js';
import { getAdminStats, getUsers, updateUserStatus, moderateListing, resolveReport } from './controllers/adminController.js';

const app = express();

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Egede Market API' });
});

app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.post('/api/auth/logout', logoutUser);
app.get('/api/auth/me', authMiddleware, getCurrentUser);
app.post('/api/auth/request-reset', requestPasswordReset);
app.post('/api/auth/reset-password', resetPassword);

app.get('/api/listings', searchListings);
app.get('/api/listings/:id', getListingById);
app.post('/api/listings', authMiddleware, requireRole('SELLER', 'SUPER_ADMIN'), createListing);
app.get('/api/my-listings', authMiddleware, requireRole('SELLER', 'SUPER_ADMIN'), getSellerListings);

app.get('/api/admin/stats', authMiddleware, requireRole('ADMIN', 'SUPER_ADMIN'), getAdminStats);
app.get('/api/admin/users', authMiddleware, requireRole('ADMIN', 'SUPER_ADMIN'), getUsers);
app.patch('/api/admin/users/:id/status', authMiddleware, requireRole('ADMIN', 'SUPER_ADMIN'), updateUserStatus);
app.patch('/api/admin/listings/:id/status', authMiddleware, requireRole('ADMIN', 'SUPER_ADMIN'), moderateListing);
app.patch('/api/admin/reports/:id/resolve', authMiddleware, requireRole('ADMIN', 'SUPER_ADMIN'), resolveReport);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error.' });
});

app.listen(config.port, () => {
  console.log(`Egede Market API running on port ${config.port}`);
});

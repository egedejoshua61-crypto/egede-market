import { query } from '../config/database.js';

export const getAdminStats = async (req, res) => {
  try {
    const [usersResult, sellersResult, listingsResult, reportsResult, revenueResult] = await Promise.all([
      query('SELECT COUNT(*)::int AS total_users FROM users'),
      query("SELECT COUNT(*)::int AS active_sellers FROM users WHERE role = 'SELLER' OR role = 'SUPER_ADMIN'"),
      query('SELECT COUNT(*)::int AS listings_count FROM listings'),
      query('SELECT COUNT(*)::int AS reports_count FROM reports'),
      query("SELECT COALESCE(SUM(price), 0)::numeric AS revenue FROM listings WHERE status = 'approved'"),
    ]);

    const stats = {
      totalUsers: usersResult.rows[0].total_users,
      activeSellers: sellersResult.rows[0].active_sellers,
      activeBuyers: 0,
      listingsCount: listingsResult.rows[0].listings_count,
      reportsCount: reportsResult.rows[0].reports_count,
      revenue: Number(revenueResult.rows[0].revenue || 0),
    };

    return res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ message: 'Unable to fetch admin stats.' });
  }
};

export const getUsers = async (req, res) => {
  const result = await query('SELECT id, name, email, role, status, verification_level, created_at FROM users ORDER BY created_at DESC');
  return res.json(result.rows);
};

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'banned', 'suspended'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  const result = await query(
    'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, name, email, status',
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json({ message: 'User status updated.', user: result.rows[0] });
};

export const moderateListing = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['approved', 'rejected', 'expired'].includes(status)) {
    return res.status(400).json({ message: 'Invalid listing status.' });
  }

  const result = await query(
    'UPDATE listings SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Listing not found.' });
  }

  return res.json({ message: 'Listing status updated.', listing: result.rows[0] });
};

export const resolveReport = async (req, res) => {
  const { id } = req.params;
  const result = await query('UPDATE reports SET resolved = true WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Report not found.' });
  }

  return res.json({ message: 'Report resolved.', report: result.rows[0] });
};

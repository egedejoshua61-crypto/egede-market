import { query } from '../config/database.js';

export const searchListings = async (req, res) => {
  try {
    const {
      keyword = '',
      category = '',
      condition = '',
      priceMin = 0,
      priceMax = 100000000,
      city = '',
      state = '',
      sort = 'newest',
      sellerType = '',
    } = req.query;

    let sql = `
      SELECT l.*, u.name AS seller_name, u.role AS seller_role
      FROM listings l
      INNER JOIN users u ON u.id = l.seller
      WHERE l.status = 'approved'
        AND l.price BETWEEN $1 AND $2
    `;
    const params = [Number(priceMin) || 0, Number(priceMax) || 100000000];

    if (keyword) {
      sql += ` AND (l.title ILIKE $${params.length + 1} OR l.description ILIKE $${params.length + 1})`;
      params.push(`%${keyword}%`);
    }

    if (category) {
      sql += ` AND l.category ILIKE $${params.length + 1}`;
      params.push(`%${category}%`);
    }

    if (condition) {
      sql += ` AND l.condition = $${params.length + 1}`;
      params.push(condition);
    }

    if (city) {
      sql += ` AND l.location ILIKE $${params.length + 1}`;
      params.push(`%${city}%`);
    }

    if (state) {
      sql += ` AND l.location ILIKE $${params.length + 1}`;
      params.push(`%${state}%`);
    }

    if (sellerType) {
      sql += ` AND u.role = $${params.length + 1}`;
      params.push(sellerType);
    }

    if (sort === 'newest') sql += ' ORDER BY l.created_at DESC';
    else if (sort === 'oldest') sql += ' ORDER BY l.created_at ASC';
    else if (sort === 'lowest') sql += ' ORDER BY l.price ASC';
    else if (sort === 'highest') sql += ' ORDER BY l.price DESC';
    else if (sort === 'most-viewed') sql += ' ORDER BY l.views DESC';
    else sql += ' ORDER BY l.created_at DESC';

    const result = await query(sql, params);
    return res.json(result.rows);
  } catch (error) {
    console.error('Search listings error:', error);
    return res.status(500).json({ message: 'Unable to search listings.' });
  }
};

export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `
        SELECT l.*, u.name AS seller_name, u.role AS seller_role
        FROM listings l
        INNER JOIN users u ON u.id = l.seller
        WHERE l.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    await query('UPDATE listings SET views = views + 1 WHERE id = $1', [id]);
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Get listing error:', error);
    return res.status(500).json({ message: 'Unable to fetch listing.' });
  }
};

export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      negotiable,
      condition,
      images,
      location,
    } = req.body;

    if (!title || !description || !category || !price || !condition || !location) {
      return res.status(400).json({ message: 'All mandatory fields are required.' });
    }

    const result = await query(
      `
        INSERT INTO listings (title, description, category, price, negotiable, condition, images, seller, location, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
        RETURNING *
      `,
      [title, description, category, Number(price), Boolean(negotiable), condition, JSON.stringify(images || []), req.user.id, location]
    );

    return res.status(201).json({ message: 'Listing created and pending approval.', listing: result.rows[0] });
  } catch (error) {
    console.error('Create listing error:', error);
    return res.status(500).json({ message: 'Unable to create listing.' });
  }
};

export const getSellerListings = async (req, res) => {
  const result = await query('SELECT * FROM listings WHERE seller = $1 ORDER BY created_at DESC', [req.user.id]);
  return res.json(result.rows);
};

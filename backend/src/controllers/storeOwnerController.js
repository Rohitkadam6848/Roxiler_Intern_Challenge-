import connection from "../config/db.js";
import validator from "validator";

export const getAverageRating = (req, res) => {
  const ownerId = req.user.id;

  connection.query(
    `
    SELECT
      s.id,
      s.name,
      ROUND(AVG(r.rating),1) AS averageRating

    FROM stores s

    LEFT JOIN ratings r
      ON s.id = r.store_id

    WHERE s.owner_id = ?

    GROUP BY s.id
    `,
    [ownerId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      res.status(200).json({
        success: true,
        stores: results,
      });
    },
  );
};

export const getStoreRatings = (req, res) => {
  const ownerId = req.user.id;

  connection.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      r.rating,
      s.name AS storeName

    FROM ratings r

    JOIN users u
      ON u.id = r.user_id

    JOIN stores s
      ON s.id = r.store_id

    WHERE s.owner_id = ?
    `,
    [ownerId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      res.status(200).json({
        success: true,
        ratings: results,
      });
    },
  );
};

// Add these below your existing functions in storeOwnerController.js

export const createStore = (req, res) => {
  const ownerId = req.user.id;
  const { name, email, address } = req.body;

  if (!name || !email || !address) {
    return res.status(400).json({
      success: false,
      message: "Store name, email, and address are required",
    });
  }

  // Optional: Email validation can go here like you have in auth

  connection.query(
    `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
    [name, email, address, ownerId],
    (err, result) => {
      if (err) {
        // Handle duplicate email error
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            success: false,
            message: "A store with this email already exists",
          });
        }
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      res.status(201).json({
        success: true,
        message: "Store created successfully",
        storeId: result.insertId,
      });
    },
  );
};

export const deleteStore = (req, res) => {
  const ownerId = req.user.id;
  const storeId = req.params.id;

  connection.query(
    `DELETE FROM stores WHERE id = ? AND owner_id = ?`,
    [storeId, ownerId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Store not found or you do not have permission to delete it",
        });
      }

      res.status(200).json({
        success: true,
        message: "Store deleted successfully",
      });
    },
  );
};

export const getSingleStoreAverageRating = (req, res) => {
  const ownerId = req.user.id;
  const storeId = req.params.id;

  connection.query(
    `
    SELECT
      s.id,
      s.name,
      IFNULL(ROUND(AVG(r.rating),1),0) AS averageRating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE s.id = ? AND s.owner_id = ?
    GROUP BY s.id
    `,
    [storeId, ownerId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Store not found or access denied",
        });
      }

      res.status(200).json({
        success: true,
        store: results[0],
      });
    },
  );
};

export const getSingleStoreRatings = (req, res) => {
  const ownerId = req.user.id;
  const storeId = req.params.id;

  connection.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      r.rating,
      r.created_at
    FROM ratings r
    JOIN users u ON u.id = r.user_id
    JOIN stores s ON s.id = r.store_id
    WHERE s.id = ? AND s.owner_id = ?
    ORDER BY r.created_at DESC
    `,
    [storeId, ownerId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      res.status(200).json({
        success: true,
        count: results.length,
        ratings: results,
      });
    },
  );
};

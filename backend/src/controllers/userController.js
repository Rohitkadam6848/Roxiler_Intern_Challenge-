import connection from "../config/db.js";
import validator from "validator";

export const getStores = (req, res) => {
  connection.query(
    `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      IFNULL(ROUND(AVG(r.rating),1),0) AS overallRating

    FROM stores s

    LEFT JOIN ratings r
      ON s.id = r.store_id

    GROUP BY s.id

    ORDER BY s.id DESC
    `,
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        stores: results,
      });
    },
  );
};

export const searchStores = (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({
      success: false,
      message: "Keyword is required",
    });
  }

  connection.query(
    `
    SELECT
      id,
      name,
      email,
      address
    FROM stores
    WHERE
      name LIKE ?
      OR address LIKE ?
    `,
    [`%${keyword}%`, `%${keyword}%`],
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        stores: results,
      });
    },
  );
};

export const submitRating = (req, res) => {
  const { store_id, rating } = req.body;

  const user_id = req.user.id;

  if (!store_id || !rating) {
    return res.status(400).json({
      success: false,
      message: "Store ID and Rating are required",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5",
    });
  }

  connection.query(
    "SELECT id FROM stores WHERE id = ?",
    [store_id],
    (err, storeResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (storeResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Store not found",
        });
      }

      connection.query(
        `
        INSERT INTO ratings
        (user_id, store_id, rating)
        VALUES (?, ?, ?)
        `,
        [user_id, store_id, rating],
        (err) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: "You have already rated this store",
            });
          }

          return res.status(201).json({
            success: true,
            message: "Rating submitted successfully",
          });
        },
      );
    },
  );
};

export const updateRating = (req, res) => {
  const { store_id, rating } = req.body;

  const user_id = req.user.id;

  if (!store_id || !rating) {
    return res.status(400).json({
      success: false,
      message: "Store ID and Rating are required",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5",
    });
  }

  connection.query(
    `
    UPDATE ratings
    SET rating = ?
    WHERE user_id = ?
      AND store_id = ?
    `,
    [rating, user_id, store_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to update rating",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Rating not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Rating updated successfully",
      });
    },
  );
};

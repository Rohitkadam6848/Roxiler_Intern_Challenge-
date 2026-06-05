import bcrypt from "bcrypt";
import validator from "validator";
import connection from "../config/db.js";

export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (!["USER", "ADMIN", "STORE_OWNER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: "Database Error",
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Email already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query(
          `INSERT INTO users
          (name, email, password, address, role)
          VALUES (?, ?, ?, ?, ?)`,
          [name, email, hashedPassword, address, role],
          (err, result) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                success: false,
                message: "Failed to create user",
              });
            }

            return res.status(201).json({
              success: true,
              message: "User Created Successfully",
              userId: result.insertId,
            });
          },
        );
      },
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllUser = (req, res) => {
  connection.query(
    `SELECT
    id,
    name,
    email,
    address,
    role,
    created_at
    FROM users ORDER BY created_at DESC
    `,
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        users: results,
      });
    },
  );
};

export const getUserById = (req, res) => {
  const { id } = req.params;

  connection.query(
    `SELECT
    id,
    name,
    email,
    address,
    role
    FROM users
    WHERE id = ?`,
    [id],
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
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user: results[0],
      });
    },
  );
};

export const addStore = (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    connection.query(
      "SELECT * FROM users WHERE id = ? AND role = 'STORE_OWNER'",
      [owner_id],
      (err, ownerResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: "Database Error",
          });
        }

        if (ownerResult.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid Store Owner",
          });
        }

        connection.query(
          "SELECT * FROM stores WHERE email = ?",
          [email],
          (err, storeResult) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                success: false,
                message: "Database Error",
              });
            }

            if (storeResult.length > 0) {
              return res.status(400).json({
                success: false,
                message: "Store email already exists",
              });
            }

            connection.query(
              `INSERT INTO stores
              (
                name,
                email,
                address,
                owner_id
              )
              VALUES (?, ?, ?, ?)`,
              [name, email, address, owner_id],
              (err, result) => {
                if (err) {
                  console.error(err);

                  return res.status(500).json({
                    success: false,
                    message: "Failed to create store",
                  });
                }

                return res.status(201).json({
                  success: true,
                  message: "Store created successfully",
                  storeId: result.insertId,
                });
              },
            );
          },
        );
      },
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllStores = (req, res) => {
  connection.query(
    `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      ROUND(AVG(r.rating),1) AS rating

    FROM stores s

    LEFT JOIN ratings r
      ON s.id = r.store_id

    GROUP BY s.id
    `,
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      return res.status(200).json({
        success: true,
        stores: results,
      });
    },
  );
};

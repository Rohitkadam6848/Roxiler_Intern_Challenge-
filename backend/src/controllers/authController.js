import connection from "../config/db.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address) {
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

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
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
            message: "Database error",
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Email already registered",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query(
          `INSERT INTO users 
          (name, email, password, address, role)
          VALUES (?, ?, ?, ?, ?)`,
          // 2. Replace hardcoded "USER" with the role variable (fallback to "USER" just in case)
          [name, email, hashedPassword, address, role || "USER"],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                success: false,
                message: "Failed to register user",
              });
            }

            return res.status(201).json({
              success: true,
              message: "User Registered Successfully",
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

export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
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

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User Not Found",
          });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: "Invalid Credentials",
          });
        }

        const token = jwt.sign(
          {
            id: user.id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );

        return res.status(200).json({
          success: true,
          message: "Login Successful",
          token,
          userId: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
        });
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

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [userId],
      async (err, results) => {
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

        const user = results[0];

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: "Old password is incorrect",
          });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

        if (!passwordRegex.test(newPassword)) {
          return res.status(400).json({
            success: false,
            message:
              "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        connection.query(
          "UPDATE users SET password = ? WHERE id = ?",
          [hashedPassword, userId],
          (err) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Failed to update password",
              });
            }

            return res.status(200).json({
              success: true,
              message: "Password updated successfully",
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

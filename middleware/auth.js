import jwt from "jsonwebtoken";

const auth = (req, res, next) => {

  try {

    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "No Token"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid Token"
    });

  }

};

export default auth;
app.use("/api/auth", authRoutes);
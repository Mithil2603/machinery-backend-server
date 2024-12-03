import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export function generateToken(user) {
  const payload = { id: user.user_id, role: user.user_type };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

export function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Access denied" });

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload; // Attach user info to the request
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
}

export function authorize(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission" });
    }
    next();
  };
}

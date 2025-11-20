import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Profile } from "passport-google-oauth20";
import { HttpError } from "../../utils/httpError";
import { UserModel } from "./auth.model";
import type { LoginInput, RegisterInput, UpdateUserInput } from "./auth.schema";

// Generate JWT token
export const generateToken = (userId: string): string => {
  const secret =
    process.env.JWT_SECRET || "your-secret-key-change-in-production";
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

// Verify JWT token
export const verifyToken = (token: string): { userId: string } => {
  const secret =
    process.env.JWT_SECRET || "your-secret-key-change-in-production";
  try {
    return jwt.verify(token, secret) as { userId: string };
  } catch (error) {
    throw new HttpError(401, "Invalid or expired token");
  }
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Register user
export const registerUser = async (data: RegisterInput) => {
  // Check if user already exists
  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw new HttpError(409, "User with this email already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await UserModel.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  // Generate token
  const token = generateToken(user._id.toString());

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    token,
  };
};

// Login user
export const loginUser = async (data: LoginInput) => {
  // Find user with password
  const user = await UserModel.findOne({ email: data.email }).select(
    "+password"
  );

  if (!user || !user.password) {
    throw new HttpError(401, "Invalid email or password");
  }

  // Check password
  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  // Generate token
  const token = generateToken(user._id.toString());

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    token,
  };
};

// Find or create user from Google OAuth
export const findOrCreateGoogleUser = async (profile: Profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new HttpError(400, "Google profile does not expose an email address");
  }
  const avatarUrl = profile.photos?.[0]?.value;
  // Check if user exists with Google ID
  let user = await UserModel.findOne({ googleId: profile.id });

  if (!user) {
    // Check if user exists with email
    user = await UserModel.findOne({ email });

    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      if (profile.photos && profile.photos.length > 0) {
        user.avatar = profile.photos[0].value;
      }
      await user.save();
    } else {
      // Create new user
      user = await UserModel.create({
        googleId: profile.id,
        email,
        name: profile.displayName,
        avatar: avatarUrl,
      });
    }
  }

  // Generate token
  const token = generateToken(user._id.toString());

  return {
    user,
    token,
  };
};

// Get user by ID
export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return user;
};

// Update user
export const updateUser = async (userId: string, data: UpdateUserInput) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};

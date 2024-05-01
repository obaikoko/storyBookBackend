import User from '../model/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

// @desc Register new User
// @route POST api/user/
// @privacy Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error('Add all field');
  }
  //   Email Validation
  const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!validEmail.test(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }
  // Password validation
  const validPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!validPassword.test(password)) {
    res.status(400);
    throw new Error(
      'Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    );
  }

  // check if user already exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error('User already exist');
  }

  // create new user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });
  if (user) {
    res.status(200);
    generateToken(res, user._id);
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }
});

// Authenticate Users
// @route POST api/user/auth
// @privacy Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('add email and/or password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('User does not exist');
  }
  if (user && (await user.matchPassword(password))) {
    res.status(200);
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid Email or Password');
  }
});

// @desc  Logout User
// @route POST api/users/logout
// @privacy Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expiresIn: new Date(0),
  });

  res.status(200);
  res.json({ message: 'Logged out user' });
});

// @desc Get User ProfileInfo
// @route Get api/users/profile
// @privacy Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (user) {
    res.status(200);
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Updates User profile
// @route PUT api/users/profile/
// @privacy Private
const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    const updatedUser = await user.save();
    res.status(200);
    res.json({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error(' User not found');
  }
});

// @desc Delete User Account
// @route POST api/users/profile/:id
// @privacy Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  if (user) {
    res.status(200);
    res.json('Account deleted successfully');
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  registerUser,
  getUserProfile,
  authUser,
  logoutUser,
  updateUser,
  deleteUser,
};

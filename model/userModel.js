import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      require: [true, 'please add a first name '],
    },
    lastName: {
      type: String,
      require: [true, 'please add a last name '],
    },
    email: {
      type: String,
      require: [true, 'please add a last name '],
      unique: true,
    },
    password: {
      type: String,
      require: [true, 'add a password'],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

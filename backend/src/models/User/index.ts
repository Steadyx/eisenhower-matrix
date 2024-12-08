import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  password: string;
  hashedID: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    hashedID: {
      type: String,
      required: [true, 'Hashed ID is required'],
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    if (err instanceof Error) {
      return next(err);
    }
  }
});

UserSchema.methods.comparePassword = async function(password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

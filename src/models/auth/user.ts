import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from '../../interfaces/auth/user';
import { bcryptHelpers } from '../../utils/helpers';

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

/*
 * mongoose pre-save hook to hash user's plaintext password
 */
userSchema.pre('save', async function (next) {
  try {
    const hashedPassword: string = await bcryptHelpers.hashPlaintextPassword(this.password as string);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

export const userModel: Model<IUser & Document> = model<IUser & Document>('users', userSchema);

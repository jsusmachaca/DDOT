import { Schema, model, Document } from 'mongoose';

export interface Preferences {
  action: number;
  comedy: number;
  drama: number;
  fancy: number;
  science_fiction: number;
  terror: number;
}

export interface IUser extends Document {
  username: string;
  password: string;
  preferences: Preferences;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  preferences: {
    action: { type: Number, default: 0 },
    comedy: { type: Number, default: 0 },
    drama: { type: Number, default: 0 },
    fancy: { type: Number, default: 0 },
    science_fiction: { type: Number, default: 0 },
    terror: { type: Number, default: 0 }
  }
});

const User = model<IUser>('User', UserSchema);

export default User;

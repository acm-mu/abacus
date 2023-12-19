import { UserType } from 'abacus'
import mongoose, { Document, Schema } from "mongoose"

export interface User extends UserType, Document { }

const userSchema = new Schema<User>({
  uid: { type: String, required: true },
  role: { type: String },
  username: { type: String },
  password: { type: String },
  display_name: { type: String },
  division: { type: String },
  school: { type: String },
  disabled: { type: Boolean }
})

const UserModel = mongoose.model<User>('User', userSchema, 'user')

export default UserModel
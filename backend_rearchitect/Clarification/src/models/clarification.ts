import { ClarificationType, ContextType } from 'abacus'
import mongoose, { Document, Schema } from "mongoose"

interface Context extends ContextType, Document { }

const contextSchema = new Schema<Context>({
  type: { type: String },
  cid: { type: String }
})

export interface Clarification extends ClarificationType, Document { }

const clarificationSchema = new Schema<Clarification>({
  cid: { type: String, required: true },
  body: { type: String },
  uid: { type: String },
  date: { type: Number },
  open: { type: Boolean },
  parent: { type: String },
  division: { type: String },
  type: { type: String },
  title: { type: String },
  context: { type: contextSchema },
  children: {
    type: [String]
  }
})

const ClarificationModel = mongoose.model<Clarification>('Clarification', clarificationSchema, 'clarification')

export default ClarificationModel
import { SubmissionType } from "abacus"
import mongoose, { Schema } from "mongoose"
import { testSchema } from "./test"

export interface Submission extends SubmissionType, Document { }

const submissionSchema = new Schema<Submission>({
  sid: { type: String, required: true },
  date: { type: Number },
  filename: { type: String },
  filesize: { type: Number },
  source: { type: String },
  project_id: { type: String },
  language: { type: String },
  md5: { type: String },
  pid: { type: String },
  runtime: { type: Number },
  released: { type: Boolean },
  score: { type: Number },
  status: { type: String },
  sub_no: { type: Number },
  tid: { type: String },
  tests: { type: [testSchema] },
  claimed: { type: String },
  viewed: { type: Boolean },
  flagged: { type: String }
})

const SubmissionModel = mongoose.model<Submission>('Submission', submissionSchema, 'submission')

export default SubmissionModel
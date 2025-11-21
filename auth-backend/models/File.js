import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  originalName: String,
  storedName: String,
  size: Number,
  extension: String,
  mimeType: String,

  uploadDate: { type: Date, default: Date.now }
});

export default mongoose.model("File", fileSchema);

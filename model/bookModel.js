import mongoose from 'mongoose';

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, 'please add a title '],
    },
    author: {
      type: String,
      require: [true, 'please add an author '],
    },
    body: {
      type: String,
      require: [true, 'please add an author '],
    },
    status: {
      type: String,
      enum: ['public', 'private'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model('Book', bookSchema);

export default Book;

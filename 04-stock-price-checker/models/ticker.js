import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const TickerSchema = new Schema({
  symbol: {
    type: String,
    required: true,
  },
  likes: {
    type: [String],
    default: [],
  },
});
export const Ticker = mongoose.model('Ticker', TickerSchema);

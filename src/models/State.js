import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
    name: String,
});

const State = mongoose.model('State',stateSchema);

export default State;
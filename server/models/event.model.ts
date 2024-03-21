import { Schema, model } from "mongoose";

// data model for events (used for MongoDB)
const EventSchema = new Schema({
    _id: String,
    event_name: String,
    predicate_name: String,
    predicate_logic: String,
    predicate_comparison_value: String,
    measurement_source: String,
});

export const Event = model("Event", EventSchema);
import mongoose from 'mongoose';

// An interface describing the properties for creating a new user
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// Interface describing the properties a User model has
interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attrs: TicketAttrs): TicketDocument;
}

// Interfsce describing what properties a User document has
interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

const TicketSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    }, {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            }
        }
    }
);

TicketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', TicketSchema);

export { Ticket };
import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

// Interface describing the properties a User model has
interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attrs: TicketAttrs): TicketDocument;
}

// Interfsce describing what properties a User document has
interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

const TicketSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
    }, {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

TicketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

// Run query to look at all orders. Find order where the ticket is the ticket we just found and order status is not cancelled.
// If we find an order from this it means the ticket is reserved
TicketSchema.methods.isReserved = async function() {
    // this === the ticket document we called is reserved on. Why we switch it to function. Arrow function fucks the this keyword up
    const existingOrder = await Order.findOne({
        ticket: this as any,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', TicketSchema);

export { Ticket, TicketDocument };
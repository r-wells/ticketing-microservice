import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@reach2/sgticketscommon';
import { TicketDocument } from './ticket';

// An interface describing the properties for creating a new user
interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
}

// Interface describing the properties a User model has
interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attrs: OrderAttrs): OrderDocument;
}

// Interfsce describing what properties a User document has
interface OrderDocument extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
    version: number;
}

const OrderSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
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

OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDocument, OrderModel>('Order', OrderSchema);

export { Order, OrderStatus };
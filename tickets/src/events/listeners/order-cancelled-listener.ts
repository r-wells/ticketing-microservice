import { Listener, Subjects, OrderCancelledEvent } from "@reach2/sgticketscommon";
import { queueGroupName } from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        // if no ticket throw err
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        // Mark the ticket as being reserved by setting orderId property
        ticket.set({ orderId: undefined });
        // Save ticket
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version
        });

        // ack the message
        msg.ack();
    }
}
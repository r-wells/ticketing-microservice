import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { ExpirationCompleteEvent, OrderStatus } from "@reach2/sgticketscommon";
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
    // Create instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    });
    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asfd',
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    // Create a fake data event
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket, order };
}


it('updates order status to cancelled', async () => {
    const { listener, data, msg, ticket, order } = await setup();
    
    await listener.onMessage(data, msg);
    
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
    const { listener, data, msg, ticket, order } = await setup();
    
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
    
});

it('acks the message', async () => {
    const { listener, data, msg, ticket, order } = await setup();
    
    // Call onMessage function with data object + message object
    await listener.onMessage(data, msg);
    
    // Assert ack function was called
    expect(msg.ack).toHaveBeenCalled();

});

import { TicketCreatedEvent } from "@reach2/sgticketscommon";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // Create instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // Create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'Concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}


it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup();
    
    // Call onMessage function with data object + message object
    await listener.onMessage(data, msg);
    
    // Assert ticket was created
    const ticket = Ticket.findById(data.id);
    expect(ticket).toBeDefined();
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    
    // Call onMessage function with data object + message object
    await listener.onMessage(data, msg);
    
    // Assert ack function was called
    expect(msg.ack).toHaveBeenCalled();

});

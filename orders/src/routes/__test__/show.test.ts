import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

it('fetches the order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    });
    await ticket.save();
    const user = global.signin();
    // Make request to build order with ticket
    const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201);
    
    // Make request to fetch the order
    const {body: fetchOrder} = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).send().expect(200);

    expect(fetchOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another user\'s order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    });
    await ticket.save();
    const user = global.signin();
    // Make request to build order with ticket
    const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201);
    
    // Make request to fetch the order
    const {body: fetchOrder} = await request(app).get(`/api/orders/${order.id}`).set('Cookie', global.signin()).send().expect(401);
});

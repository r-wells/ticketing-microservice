import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it('marks an order as cancelled', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    });
    await ticket.save();
    const user = global.signin();
    // Make request to build order with ticket
    const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201);
    
    // Make request to cancel the order
    const {body: cancelledOrder} = await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);

    //Make sure it's cancelled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

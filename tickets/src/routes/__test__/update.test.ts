import request from "supertest";
import { app } from "../../app";
import mongoose from 'mongoose';
import { natsWrapper } from './../../nats-wrapper';

it('returns a 404 if provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`).set('Cookie', global.signin()).send({
        title: 'zeeeelvf',
        price: 10
    }).expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`).send({
        title: 'zeeeelvf',
        price: 10
    }).expect(401);
});

it('returns a 401 if user does not own the ticket', async () => {
    const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
        title: 'ashdyig',
        price: 20
    });

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', global.signin()).send({
        title: 'uhvndfvdfn',
        price: 1000
    }).expect(401);
});

it('returns 400 if user provides invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
        title: 'ashdyig',
        price: 20
    });

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: '',
        price: 20
    }).expect(400);

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'dvdfdf',
        price: -20
    }).expect(400);
});

it('updates ticket provided valid inputs', async () => {
    const cookie = global.signin();
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
        title: 'ashdyig',
        price: 20
    });

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'hufvnnheus',
        price: 20
    }).expect(200);

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'dvdfdf',
        price: 200
    }).expect(200);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
        title: 'ashdyig',
        price: 20
    });

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'hufvnnheus',
        price: 20
    }).expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
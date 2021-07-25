import mongoose from 'mongoose';
import { app } from "./app";
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
    console.log('Starting tickets');
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined');
    }
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID is not defined');
    }
    if(!process.env.NATS_URL) {
        throw new Error('NATS_URL is not defined');
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID is not defined');
    }
    
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('Nats connection closed');
            process.exit();
        });
        process.on('SIGNINT', () => natsWrapper.client.close());
        process.on('SIGNTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Mongo Connection Successful');
    } catch(err) {
        console.error(err);
    }
    app.listen(3000, () => {
        console.log('Listening on port 3000');
    });
    
}
start();
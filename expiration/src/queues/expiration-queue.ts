import Queue from "bull";
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload { // Gives TS an idea of what kind of info is flowing through our queue
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    // At this point, the queue has processed and the job is done
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    });
});

export { expirationQueue };
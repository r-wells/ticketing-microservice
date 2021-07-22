import { Publisher, OrderCreatedEvent, Subjects } from "@reach2/sgticketscommon";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
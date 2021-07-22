import { Publisher, OrderCancelledEvent, Subjects } from "@reach2/sgticketscommon";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
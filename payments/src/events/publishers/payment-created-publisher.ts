import { Subjects, Publisher, PaymentCreatedEvent } from "@reach2/sgticketscommon";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
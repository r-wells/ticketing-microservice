import { Publisher, Subjects, TicketUpdatedEvent } from "@reach2/sgticketscommon";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
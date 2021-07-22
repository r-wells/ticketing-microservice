import { Publisher, Subjects, TicketCreatedEvent } from "@reach2/sgticketscommon";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
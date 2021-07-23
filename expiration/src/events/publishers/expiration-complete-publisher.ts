import { Publisher, ExpirationCompleteEvent, Subjects } from "@reach2/sgticketscommon";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
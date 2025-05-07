import cron from "node-cron";
import { CartTicket } from "../../DAL/models/Cart-Ticket.model";
import { LessThan } from "typeorm";

export const startTicketCleanupJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
    const expiredTickets = await CartTicket.find({
        where: { reservationExpiresAt: LessThan(new Date()) },
    });

    if (expiredTickets.length > 0) {
        await CartTicket.delete({
        reservationExpiresAt: LessThan(new Date()),
        });
        console.log(`Deleted ${expiredTickets.length} expired tickets~!`);
    } else {
        console.log("No expired tickets found~!");
    }
    } catch (error) {
    console.error("Error deleting expired tickets:", error);
    }
});
};

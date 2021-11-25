import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { parseISO } from "date-fns";

import CreateAppointmentService from "../services/CreateAppointmentService";
import AppointmentRepository from "../repositories/AppointmentsRepository";

const appointmentsRouter = Router();

appointmentsRouter.get("/", async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post("/", async (request, response) => {
  try {
    const { provider, date } = request.body;
    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider,
    });
    return response.json(appointment);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return response.status(400).json({ err: err.message });
    }
  }
});

export default appointmentsRouter;

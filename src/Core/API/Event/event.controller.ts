import { Request,Response,NextFunction } from "express";
import { CreateEventDto, UpdateEventDTO } from "./event.dto";
import { validate } from "class-validator";
import moment from "moment";
import { Event } from "../../../DAL/models/event.model";


const createEvent = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const { title, description, date, type, location , availableTickets } = req.body;
        if (!title || !description || !date || !type || !location || !availableTickets) {
            res.status(400).json({ message: "All fields are required~!" });
            return;
        }
        if (availableTickets < 0) {
            res.status(400).json({ message: "Available tickets cannot be negative~!" });
            return;
        }
        const dto = new CreateEventDto();
        dto.title = title;  
        dto.description = description;
        dto.type = type;
        dto.location = location;
        dto.availableTickets = availableTickets;
        const eventDate = moment(date, "DD.MM.YYYY").hours(20).minutes(0).seconds(0).toDate();
        if (!eventDate || isNaN(eventDate.getTime())) {
            res.status(400).json({ message: "Invalid date format~!" });
            return;
        }
        dto.date = eventDate;



        const errors = await validate(dto);
        if (errors.length > 0) {
            res.status(400).json({ errors: errors.map(err => err.constraints) });
            return;
        }

        const existEvent = await Event.findOne({
            where : { title }
        });
        if (existEvent) {
            res.status(400).json({ message: "Event already exists~!" });
            return;
        }

        const newEvent = Event.create({
            title,
            description,
            type,
            location,
            availableTickets,
            date: eventDate
        });
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully~!", event: newEvent });
    } catch (error) {
        next(error);
        res.status(500).json({ message: "Internal server error~!" });
    }
}

const getListEvents = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const events = await Event.find({
            relations : ["tickets"],
        });
        if (!events) {
            res.status(404).json({ 
                message: "No events found~!" 
            });
            return;
        }
        res.status(200).json({ 
            message: "Events retrieved successfully~!", 
            events 
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error~!" });
        next(error);
    }
}

const getEventById = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const EventID = Number(req.params.id);
        const event = await Event.findOne({
            where : {
                id : EventID
            },
            relations : ["tickets"]
        });
        if (!event) {
            res.status(404).json({ 
                message: "Event not found~!" 
            });
            return;
        }

        res.status(200).json({ 
            message: "Event retrieved successfully~!", 
            event 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Internal server error~!" 
        });
        next(error);
    }
}

const updatedEvent = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const EventId = Number(req.params.id);
        const updateData : UpdateEventDTO = req.body;
        const event = await Event.findOne({
            where : {
                id : EventId
            }
        });
        if (!event) {
            res.status(404).json({ 
                message: "Event not found~!" 
            });
            return;
        }
        
        Object.assign(event , updateData);
        
        const UpdatedEvent = await event.save();
        res.status(200).json({
            message : `Event updated successfully~!`,
            event : {
                title : UpdatedEvent.title,
                description : UpdatedEvent.description,
                type : UpdatedEvent.type,
                location : UpdatedEvent.location,
                availableTickets : UpdatedEvent.availableTickets,
                date : UpdatedEvent.date,
            }
        });
        return;
    } catch (error) {
        res.status(500).json({
            message : "Internal server error~!",
        });
        next(error);
    }
}

const softDeleteEvent = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const EventId = Number(req.params.id);
        const event = await Event.findOne({
            where : {
                id : EventId
            },
            relations : ["tickets"]
        });
        if (!event) {
            res.status(404).json({ 
                message: "Event not found~!" 
            });
            return;
        }

        const deletedEvent = await Event.update(EventId , {
            isDeleted : true,
            deletedAt :  new Date()
        });
        res.status(200).json({
            message : `Event deleted successfully~!`,
        });
        return;
    } catch (error) {
        res.status(500).json({
            message : "Internal server error~!",
        });
        next(error);
    }
}

export const EventController = {
    createEvent,
    getListEvents,
    getEventById,
    updatedEvent,
    softDeleteEvent,
}
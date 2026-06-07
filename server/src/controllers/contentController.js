import Event from '../models/Event.js';
import { Record, Notice } from '../models/Notice.js'; // Note: combined in previous mock for simplicity, but let's assume they export properly.
import Member from '../models/Member.js';

export const getAlumni = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear().toString();
    const alumni = await Member.find({
      batch: { $lt: currentYear }
    });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMembers = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear().toString();
    const members = await Member.find({
      batch: { $gte: currentYear }
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ displayUntil: { $gte: new Date() } });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import UploadImage from '../models/UploadImage.js';

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGalleryImages = async (req, res) => {
  try {
    const images = await UploadImage.find({}).populate('event');
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecords = async (req, res) => {
    try {
      const records = await Record.find({});
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Admin protected endpoints

export const createNotice = async (req, res) => {
    const { title, content, displayUntil } = req.body;
    try {
        const notice = new Notice({ title, content, displayUntil });
        await notice.save();
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.find({});
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editNotice = async (req , res) => {
    const id = req.params.id;

    const {title, content , displayUntil} = req.body;
    try {
        const notice = await Notice.findById(id);
        if(!notice) {
            return res.status(404).json({message: "Notice not found"});
        }
        notice.title = title || notice.title;
        notice.content = content || notice.content;
        notice.displayUntil = displayUntil || notice.displayUntil;
        await notice.save();
        res.json(notice);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteNotice = async (req, res) =>{
  const id = req.params.id;
  try {
    const notice = await Notice.findById(id);
    // console.log("this is the notic - ", notice);
    if(!notice) {
      return res.status(404).json({message: "Notice not found"});
    }
    await notice.deleteOne();
    res.json({message: "Notice deleted successfully"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}
  
export const createEvent = async (req, res) => {
    const { name, year, isAAM } = req.body;
    // correction required : arrays related to sponsors and gallery images need to be handled properly
    try {
        const event = new Event({ name, year, isAAM });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editEvent = async(req , res) => {
    const id = req.params.id;
    const {name, year, isAAM, date, chiefGuest, participationCount, bestAthleteMale, bestAthleteFemale, sponsors, images} = req.body;
    try {
        const event = await Event.findById(id);
        if(!event) {
            return res.status(404).json({message: "Event not found"});
        }
        event.name = name || event.name;
        event.year = year || event.year;
        event.isAAM = isAAM || event.isAAM;
        event.date = date || event.date;
        event.chiefGuest = chiefGuest || event.chiefGuest;
        event.participationCount = participationCount || event.participationCount;
        event.bestAthleteMale = bestAthleteMale || event.bestAthleteMale;
        event.bestAthleteFemale = bestAthleteFemale || event.bestAthleteFemale;
        event.sponsors = sponsors || event.sponsors;
        event.images = images || event.images;
        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
} 

export const deleteEvent = async(req,res) =>{
    const id = req.params.id;
    try{
      const event = await Event.findById(id);
      if(!event){
          return res.status(404).json({message: "Event not found"});
      }
      await event.deleteOne();
      res.json({message: "Event deleted successfully"});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}


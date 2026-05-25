import Event from '../models/Event.js';
import { Record, Notice } from '../models/Notice.js'; // Note: combined in previous mock for simplicity, but let's assume they export properly.
import User from '../models/User.js';

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ displayUntil: { $gte: new Date() } });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAlumni = async (req, res) => {
  try {
    const alumni = await User.find({ role: { $in: ['alumni', 'member'] } });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
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

} 

export const deleteEvent = async(req,res) =>{
  
}


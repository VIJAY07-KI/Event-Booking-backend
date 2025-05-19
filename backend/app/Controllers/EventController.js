import Event from '../Models/EventModel.js';
import { validationResult } from 'express-validator';

const eventCtrl = {};

// List all events
eventCtrl.list = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Create a new event
eventCtrl.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body = req.body;
  try {
    const event = await Event.create(body);
    res.status(201).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Show a single event by ID
eventCtrl.show = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update an existing event
eventCtrl.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const body = req.body;
  console.log(body)
  try {
     const existTitle=await Event.findOne({title:body.title})
    //  const existEvent=await Event.findById(id)
    //   if (!existEvent) {
    //   return res.status(404).json({ error: 'Event not found' });
    // }
    console.log(body.title)
    console.log(body)
    if((body.title==existTitle.title || body.title!=existTitle) && id==existTitle._id){
      console.log(body)
        const event = await Event.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    res.json(event);
    }else{
      return  res.status(400).json({ message: 'Event title is already exist' });
    }
   
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Delete an event
eventCtrl.remove = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Book a seat for an event
eventCtrl.bookSeat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const { userId } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.bookedSeats.includes(userId)) {
      return res.status(400).json({ error: 'User already booked a seat' });
    }

    if (event.bookedSeats.length >= event.totalSeats) {
      return res.status(400).json({ error: 'No seats available' });
    }

    event.bookedSeats.push(userId);
    await event.save();
    res.status(200).json({ message: 'Seat booked successfully', event });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

eventCtrl.verify=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const id=req.params.id
    const {isVerified}=req.body
    try{
      // body.isActive="true"
        const event=await Event.findByIdAndUpdate(id,{isVerified},{new:true})
        res.json(event)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}



export default eventCtrl;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Note = require('./model/note');


morgan.token("body",(req,res)=>{
  return JSON.stringify(req.body)
})


const errorHandler = (error,req,res,next)=>{
  console.error(error);
  
  if(error.name === "CastError")
    return res.status(400).json({message:"Malformatted ID"})
  else if(error.name === "ValidationError")
    return res.status(400).json({error: error.message})


  next(error);
  }

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]

app.get("/api/notes",(req,resp)=>{
  Note.find({}).then(note=>{
    resp.json(note);
  })  
});

app.get("/api/notes/:id",(req,res,next)=>{
  const id = (req.params.id);
  
  Note.findById(id).then(note=>{
    if(note)
      res.json(note);
    else 
      res.status(404).end();
  }).catch(error=>next(error));
})

app.delete("/api/notes/:id",(req,res,next)=>{
  const id = req.params.id;
  Note.findByIdAndDelete(id).then(result=>{
    res.status(204).end();
  }).catch(error=>next(error));
})


app.post("/api/notes",(req,res,next)=>{
  const fromRequest = req.body;
    
  const newNote = new Note({
    content: fromRequest.content,
    important: Boolean(fromRequest.important) || false
  })

  newNote.save().then(note=>{
    res.status(201).json(note);
  }).catch(err=>next(err));
})

app.put("/api/notes/:id", (req,res,next)=>{
  const body = req.body;
  
  const newNote = {
    content:body.content,
    important:body.important,
  }

  Note.findByIdAndUpdate(req.params.id, newNote, {new:true, runValidators:true, context:'query'}).then(result=>{
    res.json(result)
  }).catch(err => next(err));
})

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
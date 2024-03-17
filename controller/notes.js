const noteRouter = require('express').Router();
const Note = require('../model/note');

noteRouter.get('/', (req, resp) => {
  Note.find({}).then((note) => {
    resp.json(note);
  });
});

noteRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Note.findById(id).then((note) => {
    if (note) { res.json(note); } else { res.status(404).end(); }
  }).catch((error) => next(error));
});

noteRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id).then(() => {
    res.status(204).end();
  }).catch((error) => next(error));
});

noteRouter.post('/', (req, res, next) => {
  const fromRequest = req.body;

  const newNote = new Note({
    content: fromRequest.content,
    important: Boolean(fromRequest.important) || false,
  });

  newNote.save().then((note) => {
    res.status(201).json(note);
  }).catch((err) => next(err));
});

noteRouter.put('/:id', (req, res, next) => {
  const { body } = req;

  const newNote = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, newNote, { new: true, runValidators: true, context: 'query' }).then((result) => {
    res.json(result);
  }).catch((err) => next(err));
});

module.exports = noteRouter;

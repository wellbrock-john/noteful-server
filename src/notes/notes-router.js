const express = require("express");
const xss = require("xss");
const { v4: uuidv4 } = require("uuid");
const logger = require("../logger");
const NotesService = require("./notes-service");

const notesRouter = express.Router();
const bodyParser = express.json();

const serializeNote = (note) => ({
	id: note.id,
	name: xss(note.name),
	modified: note.modified,
	content: xss(note.content),
	folder_id: note.folder_id,
});

notesRouter
	.route("/")
	.get((req, res, next) => {
		NotesService.getAllNotes(req.app.get("db"))
			.then((notes) => {
				res.json(notes.map(serializeNote));
			})
			.catch(next);
	})
	.post(bodyParser, (req, res, next) => {
		for (const field of ["name", "modified", "folder_id", "content"]) {
			if (!req.body[field]) {
				logger.error(`${field} is required`);
				return res.status(400).send(`'${field}' is required`);
			}
		}

		const { name, modified, folder_id, content } = req.body;
		console.log(req.body);
		const newNote = { name, modified, folder_id, content };

		NotesService.insertNote(req.app.get("db"), newNote)
			.then((note) => {
				logger.info(`Note with id ${note.id} created.`);
				res.status(201).location(`/notes/${note.id}`).json(serializeNote(note));
			})
			.catch(next);
	});

notesRouter
	.route("/:id")
	.all((req, res, next) => {
		const { id } = req.params;
		NotesService.getNoteById(req.app.get("db"), id)
			.then((note) => {
				if (!note) {
					logger.error(`Note with id ${id} not found.`);
					return res.status(404).json({
						error: { message: `Note Not Found` },
					});
				}
				res.note = note;
				next();
			})
			.catch(next);
	})
	.get((req, res) => {
		res.json(serializeNote(res.note));
	})
	.delete((req, res, next) => {
		const { id } = req.params;
		NotesService.deleteNote(req.app.get("db"), id)
			.then((numRowsAffected) => {
				logger.info(`Note with id ${id} deleted.`);
				res.status(204).end();
			})
			.catch(next);
	});

module.exports = notesRouter;

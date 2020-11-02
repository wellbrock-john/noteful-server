const knex = require("knex");
const app = require("../src/app");
const { makeFoldersArray, makeMaliciousFolder } = require("./folders.fixtures");
const supertest = require("supertest");
const { expect } = require("chai");

describe("Folders Endpoints", function () {
	let db;
	const cleanup = () =>
		db.raw(
			`TRUNCATE
        noteful_folders`
		);

	before("make knex instance", () => {
		db = knex({
			client: "pg",
			connection: process.env.TEST_DB_URL,
		});
		app.set("db", db);
	});

	after("disconnect from db", () => db.destroy());

	before("cleanup", () => cleanup());

	afterEach("cleanup", () => cleanup());

	describe(`GET /api/folders`, () => {
		context(`Given no folders`, () => {
			it(`responds with 200 and an empty list`, () => {
				return supertest(app).get("/api/folders").expect(200, []);
			});
		});

		context("Given there are folders in the database", () => {
			const testFolders = makeFoldersArray();

			beforeEach("insert folders", () => {
				return db.into("noteful_folders").insert(testFolders);
			});

			it("responds with 200 and all of the folders", () => {
				return supertest(app).get("/api/folders").expect(200, testFolders);
			});
		});

		context(`Given an XSS attack folder`, () => {
			const { maliciousFolder, expectedFolder } = makeMaliciousFolder();

			beforeEach("insert malicious folder", () => {
				return db.into("noteful_folders").insert([maliciousFolder]);
			});
			it("removes XSS attack content", () => {
				return supertest(app)
					.get(`/api/folders`)
					.expect(200)
					.expect((res) => {
						expect(res.body[0].folder_id).to.eql(expectedFolder.folder_id);
						expect(res.body[0].folder_name).to.eql(expectedFolder.folder_name);
					});
			});
		});
	});
});

import stream from "node:stream";
import { parseArgs } from "node:util";
import { z } from "zod";
import { err, ok, Result } from "neverthrow";
import { pino } from "pino";
import { assert } from "@std/assert";
import { Database } from "bun:sqlite";
import { backup } from "./db/backup";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./db/schema.ts";
import { KV } from "./db/kv.ts";
import { LoadCommand } from "./commands/load.ts";
import { UploadCommand } from "./commands/upload.ts";

const Args = z.object({
	values: z.object({
		command: z.enum(["load", "upload"]).describe("command to execute"),
		db: z.string().describe("sqlite connection URI"),
		storageURI: z.string().optional().describe("with upload command")
	}),
});

class ErrInvalidCommand extends Error {
}

ErrInvalidCommand.prototype.name = "ErrInvalidCommand";

export type GetEnv = (name: string) => string | undefined;
export type GetCwd = () => string;

export async function run(args: string[], stdin: stream.Readable, stdout: stream.Writable, getEnv: GetEnv, getCwd: GetCwd): Promise<Result<undefined, Error>> {
	const { values } = Args.parse(
		parseArgs({
			args: args.slice(2), // Skip `node` and script name
			options: {
				command: {
					type: "string",
				},
				storageURI: {
					type: "string",
					default: getEnv("STORAGE_URI"),
				},
				db: {
					type: "string",
				},
			},
		})
	);

	const requireEnv = (key: string): string => {
		const v = getEnv(key);
		assert(!!v, `environment variable ${key} is required`);
		return v;
	};

	const errExit = async (e: Error) => {
		logger.fatal(e);
		logger.flush();
		return err(e);
	};

	const logger = pino(pino.destination(stdout));
	const sqlite = new Database(values.db, { create: true });
	sqlite.exec("PRAGMA journal_mode = WAL;"); // enable Write-Ahead Log
	await backup(sqlite.filename);

	const db = drizzle(sqlite, { schema });
	const kv = new KV(db);

	try {
		console.info("executing command %s", values.command);
		if (values.command === "load") {
			await LoadCommand({
				logger: logger.child({ command: "load" }),
				kv,
				db
			});
		} else if (values.command === "upload") {
			assert(!!values.storageURI, "storage URI should be defined for the upload command");
			await UploadCommand({
				logger: logger.child({ command: "upload" }),
				db,
				kv,
				storageURI: values.storageURI,
				providerSecret: requireEnv("SOME_SECRET")
			});
		} else {
			return errExit(new ErrInvalidCommand(values.command));
		}
	} catch (e) {
		return errExit(e as Error);
	}

	logger.flush();
	return ok(undefined);
}


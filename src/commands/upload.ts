import { fn } from "../lib/fn.ts";
import { z } from "zod";
import type { Logger } from "pino";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type { KV } from "../db/kv.ts";

export const UploadCommand = fn(z.object({
	logger: z.custom<Logger>(),
	db: z.custom<BunSQLiteDatabase<any>>(),
	kv: z.custom<KV>(),
	storageURI: z.string(),
	providerSecret: z.string()
}), async (input) => {
	const { logger, db, kv, storageURI, providerSecret } = input;

});

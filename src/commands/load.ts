import { z } from "zod";
import type { Logger } from "pino";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type { KV } from "../db/kv.ts";
import { fn } from "../lib/fn.ts";

export const LoadCommand = fn(z.object({
	logger: z.custom<Logger>(),
	db: z.custom<BunSQLiteDatabase<any>>(),
	kv: z.custom<KV>()
}), async (input) => {
	const { logger, db, kv } = input;

	/* do command */
});

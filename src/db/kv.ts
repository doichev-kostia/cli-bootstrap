import { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { kv } from "./schema.ts";
import { eq, sql } from "drizzle-orm";
import type { z, ZodSchema } from "zod";
import { None, type Option } from "../lib/option.ts";
import { err, ok } from "neverthrow";

export class KV {
	constructor(public db: BunSQLiteDatabase<any>) {
	}

	async get<A extends ZodSchema>(key: string, schema: A): Promise<Option<z.infer<A>>> {
		const rows = await this.db.select().from(kv).where(eq(kv.key, key));

		if (rows.length == 0) {
			return err(None);
		}

		const row = rows[0]; // value is parsed JSON
		return ok(schema.parse(row.value));
	}

	async put(key: string, value: any ): Promise<void> {
		await this.db.insert(kv).values({ key, value }).onConflictDoUpdate({
			target: [kv.key],
			set: {
				value: sql`excluded.value`
			}
		});
	}
}

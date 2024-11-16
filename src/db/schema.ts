import { sqliteTable, text } from "drizzle-orm/sqlite-core";

const ULID_SIZE = 24;
export const PREFIX_SIZE = 10;

export const brandedID = (name: string) => text(name, { length: ULID_SIZE + PREFIX_SIZE });

export const id = {
	get id() {
		return brandedID("id").primaryKey().notNull();
	},
};

export const timestamps = {
	get createTime() {
		return text("create_time").notNull().$defaultFn(() => new Date().toISOString());
	},
	get updateTime() {
		return text("update_time").notNull().$defaultFn(() => new Date().toISOString()).$onUpdateFn(() => new Date().toISOString());
	},
};


export const kv = sqliteTable("kv", {
	key: text("key").primaryKey().notNull(),
	value: text("value", { mode: "json" }).$type<any>().notNull()
});

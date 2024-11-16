.envrc
```
export DB_FILENAME="./database.sqlite"
export SOME_SECRET="op://<vault>/<item_name>/<field_name>"
```

run
```shell
direnv allow
op run -- bun run ./src/main.ts
```

Some things I like when building CLIs

- Use commands for different actions
- Use the `run` function that accepts the args, stdin, stdout, stderr and env vars, so it's easier to test it
- Have a `core` module
- Have branded ids `acc_<ulid>` 
- Use result/option monads for some operations

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

# DBを作成したい場合は以下を実行する
## .env.exampleをリネームし、PlanetScaleの接続情報を設定する
.env.example -> .env

## 以下のコマンドを順に実行する
```
pnpm i

pnpm push
pnpm seed
```
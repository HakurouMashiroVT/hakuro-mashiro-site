今日の配信！方式 v1

更新対象：data/today-stream.json
日付は日本時間で YYYY-MM-DD。タイトルとYouTube待機所URLを登録してください。
例：
{
  "date": "2026-10-22",
  "title": "【配信】今日のゲーム配信！",
  "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX"
}
（XXXXXXXXXXXは実際の11文字の動画IDに置換）

登録日の00:00から翌日05:00（JST）まで表示。期限を過ぎるとブラウザ側で非表示。
YouTube埋め込みはサムネイルを含めYouTube側から表示します。別途サムネ画像のアップロードは不要です。
サイトが公開中でもJSONだけGitHubで編集できます。

旧LIVE自動検知のlive.jsとdata/live-status.jsonは互換性のため残していますが、index.htmlからは呼び出しません。
GitHub Actionsの既存live-status.ymlはこのZIPには含まれません。GitHub上で残っている場合、不要なら後から停止できます。
他の既存素材は変更していません。

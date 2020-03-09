# Example Video Distribution

AWSを使ったビデオ配信のプロジェクトです。

## terraform

AWSのリソースを構築します。

- S3バケット
  - アップロード＆配信用バケット
  - CloudFrontログ用
- CloudFront（配信）

## serverless

動画変換のためのエンドポイントを提供します。

### エンドポイント

#### GET /

テスト用のHTMLビューを返却するエンドポイントです。

#### GET /prepare

アップロードの事前情報を返却するエンドポイントです。

**リクエストサンプル**

```text
GET /prepare?content-type=video%2Fmp4
```

**レスポンスサンプル**

```json
{
  "id": "1eb32ed3-40f8-4fcc-be60-e847e5b84844",
  "uploadUrl": "https"
}
```

#### POST /request_convert

#### GET /status

### Deploy

```bash
# Install libraries
$ npm ci

# Deploy for development
$ npm run deploy

# Deploy for production
$ npm run deploy:prd
```

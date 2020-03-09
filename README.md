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
  "videoId": "8b8be73c-c955-481e-a3ee-011a0accd51b",
  "uploadUrl": "ps://example-video-distribution-dev.s3.ap-northeast-1.amazonaws.com/_source/8b8be73c-c955-481e-a3ee-011a0accd51b?AWSAccessKeyId=ASIAZMLC3B42K5GO..."
}
```

#### PUT /convert/{video-id}


**リクエストサンプル**

```text
PUT /convert/8b8be73c-c955-481e-a3ee-011a0accd51b
```

**レスポンスサンプル**

```json
{
  "url": "https://d1wfkbka4um3up.cloudfront.net/8b8be73c-c955-481e-a3ee-011a0accd51b/hls1/video.m3u8",
  "job": {<MediaConvertのジョブ情報>}
}
```

#### GET /info/{video-id}

```text
GET /info/8b8be73c-c955-481e-a3ee-011a0accd51b
```

**レスポンスサンプル**

```json
{
  "jobId": "1583726864783-8cdb4i",
  "job": {<MediaConvertのジョブ情報>}
}
```

### Deploy

```bash
# Install libraries
$ npm ci

# Deploy for development
$ npm run deploy

# Deploy for production
$ npm run deploy:prd
```

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
GET /prepare?contentType=video%2Fmp4
```

**レスポンスサンプル**

```json
{
  "id": "8b8be73c-c955-481e-a3ee-011a0accd51b",
  "uploadUrl": "ps://example-video-distribution-dev.s3.ap-northeast-1.amazonaws.com/_source/8b8be73c-c955-481e-a3ee-011a0accd51b?AWSAccessKeyId=ASIAZMLC3B42K5GO..."
}
```

#### PUT /convert/{id}

変換をリクエストするエンドポイントです。

**リクエストサンプル**

```text
PUT /convert/8b8be73c-c955-481e-a3ee-011a0accd51b
```

**レスポンスサンプル**

```json
{
  "id": "3b2a785e-df5b-4181-be33-ea3264484f61",
  "jobId": "1583823837499-4addfl"
}
```

#### GET /info/{id}

```text
GET /info/8b8be73c-c955-481e-a3ee-011a0accd51b
```

**レスポンスサンプル**

```json
{
  "id": "3b2a785e-df5b-4181-be33-ea3264484f61",
  "jobId": "1583823837499-4addfl",
  "finished": true,
  "source": {
    "url": "s3://example-video-distribution-dev/_source/220b8211-fcf4-446a-8a60-28a02ed56029",
    "contentType": "video/mp4",
    "s3Bucket": "example-video-distribution-dev",
    "s3ObjectKey": "_source/220b8211-fcf4-446a-8a60-28a02ed56029"
  },
  "videos": [
    {
      "mediaType": "HLS",
      "url": "https://d1wfkbka4um3up.cloudfront.net/1177e2cc-6be7-4ab9-a1c5-43de0e023f44/hls1/video.m3u8"
    }
  ],
  "thumbnails": [
    {
      "url": "https://d1wfkbka4um3up.cloudfront.net/1177e2cc-6be7-4ab9-a1c5-43de0e023f44/thumbnail/image.0000000.jpg"
    }
  ],
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
$ npm run deploy:prod
```

resource "aws_s3_bucket" "streaming_example_cdn" {
  bucket = "streaming-cdn-347676319"
  acl    = "private"
}

resource "aws_s3_bucket" "streaming_example_cdn_logs" {
  bucket = "streaming-cdn-347676319-logs"
  acl    = "private"
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.streaming_example_cdn.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.streaming_example_cdn.arn]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "example" {
  bucket = aws_s3_bucket.streaming_example_cdn.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "streaming-cdn-347676319 origin access identity"
}

resource "aws_cloudfront_distribution" "cloudfront_distribution" {
  origin {
    domain_name = aws_s3_bucket.streaming_example_cdn.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "streaming-cdn-347676319"
  default_root_object = "index.html"

  logging_config {
    include_cookies = false
    bucket          = "${aws_s3_bucket.streaming_example_cdn_logs.bucket}.s3.amazonaws.com"
    prefix          = ""
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404.html"
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["JP"]
    }
  }

  tags = {
    Environment = "production"
  }

  viewer_certificate {
    acm_certificate_arn      = "arn:aws:acm:us-east-1:644989259572:certificate/a0257a74-37b7-4663-a296-02844d807f78"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }
}

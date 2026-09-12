# Kal Ontha (كأنثى) - Global Deployment Architecture

As outlined in `plan.txt`, this project uses a multi-tier global infrastructure designed for high speed, minimal latency worldwide, and zero egress cost:

---

## 1. Frontend: Cloudflare Pages
- **Why Cloudflare Pages?**
  - Instant edge distribution across 300+ cities worldwide.
  - Zero bandwidth costs for public static content (Book, Author, Contact, Login).
  - Free automatic SSL certificates and HTTP/3 support.
- **Build Settings**:
  - Framework preset: `Vite`
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Root directory: `frontend`

---

## 2. Protected Media & Book Pages: Cloudflare R2
- **Why Cloudflare R2?**
  - **Zero egress fees**: In a page-by-page reader, readers request dozens of page images per session. Standard S3 or cloud storage would charge egress per GB. R2 eliminates egress fees completely.
  - Generates presigned URLs or allows backend worker proxying.
- **Private bucket config**:
  - Bucket name: `kal-ontha-pages-private`
  - Access: Private (only backend API credentials or Cloudflare Worker can read).

---

## 3. Dynamic Backend & Reader API: Fly.io or DigitalOcean
- **Backend Components**:
  - Device-locking authentication logic.
  - Rate limiting per reader session.
  - Short-lived signed page token generation (60-90s TTL).
  - Contact form ingestion.
- **Regions**:
  - For primary Arabic audience: Frankfurt (`fra`) or Bahrain (`bah`) for sub-50ms latency across Middle East and Europe.

---

## 4. Database: PostgreSQL (Neon / DigitalOcean Managed DB)
- **Schema**:
  - `users`: ID, email, hashed password, `device_token`, `is_locked`.
  - `books`: ID, title, subtitle, author, description, `total_pages`.
  - `book_pages`: ID, book_id, `page_number`, `image_key`.
  - `contact_messages`: ID, name, email, message, timestamp.

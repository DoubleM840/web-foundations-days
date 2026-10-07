# SnapShare Scaling Plan

## Assumptions & Load Estimates

**Base Assumptions:**
-   10,000,000 registered users
-   10% Daily Active Users (DAU) = 1,000,000 active users/day
-   Each active user uploads 1 photo/day
-   Each active user views 50 feed pages/day
-   Average photo size: 2 MB | Thumbnail size: 50 KB
-   Engineering rounding: 1 day ≈ 100,000 seconds

**Calculated Metrics:**
-   **Uploads/sec (Average):** 1M uploads ÷ 100k sec = **10 writes/sec**
-   **Feed Views/sec (Average):** 1M users × 50 views ÷ 100k sec = **500 reads/sec**
-   **Peak Traffic (5× average):** ~50 uploads/sec | ~2,500 reads/sec
-   **Storage/Year:** 1M photos/day × 2.05 MB × 365 days ≈ **748 TB/year**

**System Profile:** This system is overwhelmingly **read-heavy** (50:1 read-to-write ratio). The design must prioritize caching feed data and serving static assets via CDN, while treating uploads as an asynchronous background process to keep the API responsive.

## Why Photos Don't Live in the Database

Storing 2MB binary blobs directly in a relational database would catastrophically degrade query performance, bloat backup sizes, and make replication lag unbearable. Instead, photos belong in **Object Storage** (e.g., AWS S3, Cloudflare R2), which is optimized for massive binary files with infinite horizontal scaling. The database stores only lightweight metadata (URLs, captions, timestamps) and foreign keys pointing to the object storage location.

## Architecture Diagram

```text
                    ┌─────────────┐
         ┌─────────>│    DNS      │ (snapshare.com → Edge IPs)
         │          └─────────────┘
┌────────┴──────┐     Static Assets      ┌──────────────────┐
│  Browser /    │ ──────────────────────> │  CDN             │
│  Mobile App   │                         │ (Photos/Thumbs)  │
└──────────────┘                         └──────────────────┘
         │ API Calls (HTTPS/JSON)
         ▼
   ┌───────────────┐
   │ Load Balancer │ (Round-robin + Health Checks)
   └──────┬────────┘
     ┌─────────┬──────────┐
     ▼          ▼          ▼
 ┌───────┐  ┌───────┐  ───────┐       ┌──────────────┐
 │ App 1 │  │ App 2 │  │ App 3 │──────>│ Redis Cache   │
 └───┬───┘  └───┬───┘  └──────┘       │ (Feed Data)   │
     │ Writes   │ Reads    │ Jobs      └──────────────┘
     ▼          ▼          ▼
 ┌───────── ┌──────────┐ ┌───────┐   ┌────────────┐
 │ Primary │>| Read     │ │ Queue │──>│ Worker      │
 │   DB    │ | Replicas │ └───────┘   │ (Thumbnails)│
 └─────────┘ └──────────             └──────┬─────┘
                                             │ Uploads
                                             ▼
                                      ┌──────────────┐
                                      │ Object Store │
                                      │ (S3/R2)      │
                                      └──────────────┘
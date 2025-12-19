# Firestore Indexes Explanation

Based on the application's query patterns, the following indexes are required to support ordering and filtering.

## 1. Threads by Feed (Public/All)
**Query:** Get all threads ordered by `createdAt` descending.
**Index:**
- Not strictly required for single-field sort if "createdAt" is indexed by default (which it is).
- **Status:** *Auto-supported* by Firestore single-field indexes.

## 2. Threads by Author (Profile Page)
**Query:** `threads.where("authorId", "==", uid).orderBy("createdAt", "desc")`
**Requirement:** Composite Index
**Fields:**
- `authorId` : Ascending
- `createdAt` : Descending

## 3. Comments by Thread
**Query:** `comments.where("threadId", "==", threadId).orderBy("createdAt", "asc")`
**Requirement:** Composite Index
**Fields:**
- `threadId` : Ascending
- `createdAt` : Ascending

## 4. Threads by Category
**Query:** `threads.where("categoryId", "==", catId).orderBy("createdAt", "desc")`
**Requirement:** Composite Index
**Fields:**
- `categoryId` : Ascending
- `createdAt` : Descending

## Usage Note
When you run these queries in your application for the first time, the Firebase Console (or the error message in the browser console) will provide a direct link to create these specific indexes tailored to your database.

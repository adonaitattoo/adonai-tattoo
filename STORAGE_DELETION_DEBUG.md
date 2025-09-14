# 🔍 Storage Deletion Debug Guide

## 🚨 Issue: Images Not Deleting from Firebase Storage

Database deletions work, but Storage files remain. Let's debug this step by step.

## 🧪 Debug Steps

### 1. Check Console Logs
When you delete an image from the admin panel, check the browser console for these logs:

```
Attempting to delete image: { id: "...", imageUrl: "..." }
Parsed URL: { pathname: "...", search: "..." }
Extracted file path: "..."
✅ Successfully deleted image from storage: "..."
```

### 2. Possible Issues & Solutions

#### **Issue A: Firebase Storage Rules**
Your current Storage rules might be blocking deletions:

```javascript
// Current rules (might be blocking):
allow write, delete: if request.auth != null 
  && request.auth.token.email in [
    "christopher.j.mcelwain@genuilabs.com",
    "stevewhitetattoo@gmail.com"
  ];
```

**Test:** Temporarily change Storage rules to:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write, delete: if true; // Temporarily open for testing
    }
  }
}
```

#### **Issue B: URL Format Problem**
Firebase Storage URLs can have different formats:

**Format 1:** `https://firebasestorage.googleapis.com/v0/b/bucket/o/gallery%2Ffile.jpg?alt=media&token=...`
**Format 2:** `https://storage.googleapis.com/bucket/gallery/file.jpg`

#### **Issue C: Authentication Context**
The client-side Firebase Auth might not be properly authenticated when calling `deleteObject()`.

## 🔧 Quick Test

1. **Upload a test image** in admin panel
2. **Open browser console** (F12)
3. **Delete the image** and watch console logs
4. **Report what you see** - especially any error messages

## 🚀 Alternative Fix

If the current approach fails, we can implement **server-side deletion** via API route:

```typescript
// /api/admin/delete-image/[id]/route.ts
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Server-side deletion with Admin SDK
  // This bypasses client-side auth issues
}
```

## 📋 What to Check

1. **Console logs** during deletion
2. **Firebase Storage rules** (try temporarily open rules)
3. **Network tab** for any failed requests
4. **Firebase Console** - check if files actually exist in Storage

Let me know what the console shows when you delete an image!

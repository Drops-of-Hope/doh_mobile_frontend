# Backend Integration Requirements

This document outlines the backend API endpoints and contracts required for the mobile app's donation flow implementation.

## Overview

The frontend has been updated to support the complete donation flow including QR code scanning, attendance marking, donation form submission, and status tracking with step-by-step progress indicators.

## Required API Endpoints

### 1. Mark Attendance Endpoint

**Endpoint:** `POST /api/qr/mark-attendance`

**Purpose:** Mark user attendance when QR code is scanned by hospital staff or campaign organizers.

**Request Body:**
```json
{
  "userId": "string",
  "scannedBy": "hospital" | "campaign"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "campaignTitle": "string" // Optional: only present when scannedBy = "campaign"
}
```

**Error Codes:**
- `400` - Invalid request data
- `404` - User not found
- `409` - Attendance already marked

---

### 2. Get Donation Status Endpoint

**Endpoint:** `GET /api/donations/form/status/{userId}`

**Purpose:** Retrieve current donation status and progress for a user.

**Response:**
```json
{
  "attendanceMarked": boolean,
  "formStatus": "not_filled" | "filled" | "submitted",
  "screeningStatus": "pending" | "in_progress" | "approved" | "rejected",
  "eligibleForDonation": boolean,
  "campaignTitle": "string" // Optional: present if user joined via campaign
}
```

**Error Codes:**
- `404` - User not found
- `500` - Server error

---

### 3. Submit Donation Form Endpoint

**Endpoint:** `POST /api/donations/form`

**Purpose:** Submit completed donation form with health questionnaire responses.

**Request Body:**
```json
{
  "userId": "string",
  "formData": {
    "anyDifficulty": boolean,
    "medicalAdvice": boolean,
    "feelingWell": boolean,
    "takingMedicines": boolean,
    "anySurgery": boolean,
    "pregnant": boolean,
    "haveHepatitis": boolean,
    "tattoos": boolean,
    "travelledAbroad": boolean,
    "receivedBlood": boolean,
    "chemotherapy": boolean,
    "bookAspin": boolean,
    "knowledgeAgent": boolean,
    "feverLymphNode": boolean
  }
}
```

**Response:**
```json
{
  "success": boolean,
  "status": "submitted",
  "message": "Form submitted successfully"
}
```

**Error Codes:**
- `400` - Invalid form data or validation errors
- `404` - User not found
- `409` - Form already submitted
- `422` - User not eligible for donation

---

## Push Notifications

### Attendance Confirmation Notification

**Trigger:** When attendance is successfully marked via QR scan

**Hospital Scan:**
```json
{
  "type": "attendance_marked",
  "title": "Attendance Recorded",
  "message": "Attendance recorded at hospital.",
  "data": {
    "userId": "string",
    "scannedBy": "hospital",
    "timestamp": "ISO 8601 datetime"
  }
}
```

**Campaign Scan:**
```json
{
  "type": "attendance_marked",
  "title": "Campaign Attendance",
  "message": "Your attendance at {Campaign Title} has been recorded.",
  "data": {
    "userId": "string",
    "scannedBy": "campaign",
    "campaignTitle": "string",
    "timestamp": "ISO 8601 datetime"
  }
}
```

### Form Submission Confirmation

**Trigger:** When donation form is successfully submitted

```json
{
  "type": "form_submitted",
  "title": "Form Submitted",
  "message": "Application submitted successfully. Please proceed to medical screening.",
  "data": {
    "userId": "string",
    "timestamp": "ISO 8601 datetime"
  }
}
```

---

## Frontend Behavior Requirements

### QR Code Display Logic

1. **Initial State:** Show "Show QR Code" button
2. **After First Scan:** QR code hides automatically, "Show QR" button appears
3. **After Attendance Marked:** "Show QR" button remains, donation form becomes available

### Step Cards Display Logic

**Step 1 - Donation Form:**
- `not_filled`: "Please fill out the donation form."
- `filled`: "You have filled the form. Please review and submit."
- `submitted`: "Form submitted successfully."

**Step 2 - Medical Screening:**
- `pending`: "Please proceed to medical officer for screening. Checklist: weight/BP recorded?"
- `in_progress`: "Medical screening in progress. Please wait."
- `approved`: "Congratulations, you are eligible! Please proceed to donation bed."
- `rejected`: "You are not fit to donate. Please leave the premises."

**Step 3 - Donation Process:**
- Only shown when screening status is `approved` or `rejected`
- `approved`: "Do not move until process is complete. Consult officer if unwell."
- `rejected`: "Thank you for your time. Please visit us again when eligible."

---

## Error Handling

### Consistent Response Format

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### Common Error Codes

- `USER_NOT_FOUND` - User ID does not exist
- `ATTENDANCE_ALREADY_MARKED` - Attendance has already been recorded
- `FORM_ALREADY_SUBMITTED` - User has already submitted the donation form
- `NOT_ELIGIBLE` - User is not eligible to donate
- `INVALID_STATE` - Operation not allowed in current state
- `VALIDATION_ERROR` - Request data validation failed

---

## Implementation Notes

### Database Schema Considerations

The backend should track:
1. User attendance status (hospital vs campaign)
2. Donation form submission timestamp and data
3. Medical screening status and results
4. Eligibility flags and reasons

### Security Requirements

1. All endpoints require user authentication
2. Validate user permissions for operations
3. Rate limiting on QR scan endpoints
4. Audit logging for all donation-related operations

### Integration Points

The frontend expects the backend to:
1. Send push notifications for attendance and form submission
2. Validate donation eligibility based on health responses
3. Track donation progress through the medical screening process
4. Provide real-time status updates for the step cards UI

---

## Testing Scenarios

### Happy Path
1. User shows QR code → Staff scans → Attendance marked → Notification sent
2. User fills donation form → Form submitted → Status updated → Notification sent
3. Medical screening → Status progresses through pending → approved → donation complete

### Error Scenarios
1. Duplicate attendance marking
2. Form submission without attendance
3. Invalid health responses disqualifying donation
4. Network failures with proper error messaging

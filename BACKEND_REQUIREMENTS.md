# Backend API Requirements - Expenses and Reports

This document outlines the new backend API requirements to match the frontend implementation.

## Base URL
All endpoints should be prefixed with `/api`

---

## 1. Expenses Management Endpoints

### 1.1 Create Expense Record
**Endpoint:** `POST /api/Expenses/add-expense-record`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "cost": number (decimal)
}
```

**Response:** 
- Status: `200 OK` or `201 Created`
- Body: Same as request body (CreateExpense DTO)

**Validation:**
- `name`: Required, string
- `description`: Required, string
- `cost`: Required, number, must be >= 0

---

### 1.2 Get All Expenses Records
**Endpoint:** `GET /api/Expenses/all-expenses-records`

**Query Parameters:**
- `date` (optional): Filter by specific date (format: YYYY-MM-DD). If provided, return expenses for that date only. If empty/null, return all expenses.

**Response:**
```json
{
  "results": [
    {
      "id": number,
      "name": "string",
      "description": "string",
      "cost": number,
      "createdAt": "ISO 8601 date string"
    }
  ]
}
```

**Notes:**
- If `date` parameter is provided, filter expenses where the expense was created on that date
- If `date` is empty/null/not provided, return all expense records
- `createdAt` should be in ISO 8601 format (e.g., "2026-01-03T09:00:00")

---

## 2. Report Endpoints

### 2.1 Total Expenses Report
**Endpoint:** `GET /api/Report/totalexpenses`

**Query Parameters:** None

**Response:**
```json
{
  "results": number
}
```

**Description:**
- Returns the sum of all `cost` values from all expense records
- The `results` field should contain a single number (the total)
- Example response: `{ "results": 15000.50 }`

---

### 2.2 Total Profit Report
**Endpoint:** `GET /api/Report/totalprofit`

**Query Parameters:** None

**Response:**
```json
{
  "results": number
}
```

**Description:**
- Returns the calculated profit: `Total Sales - Total Expenses`
- Use the same calculation method as `/api/Report/totalsales` for sales
- Use the sum from `/api/Report/totalexpenses` for expenses
- The `results` field should contain a single number (the profit)
- Profit can be negative if expenses exceed sales
- Example response: `{ "results": 50000.75 }`

---

## 3. Database Model - Expense

### Expense Entity
```typescript
{
  id: number (auto-increment, primary key)
  name: string (required)
  description: string (required)
  cost: number (required, decimal)
  createdAt: DateTime (auto-generated on creation)
  updatedAt?: DateTime (optional, if you track updates)
}
```

### Notes:
- `cost` should support decimal values (precision: 2 decimal places recommended)
- `createdAt` should be automatically set when creating a new expense
- Ensure `id` is unique and auto-incrementing

---

## 4. Response Format Consistency

All GET endpoints that return collections should follow this format:
```json
{
  "results": Array<T>
}
```

Where `T` is the entity type (Expense, Sales, etc.)

For single-value reports (totals), wrap the number in the same structure:
```json
{
  "results": number
}
```

---

## 5. Error Handling

All endpoints should return appropriate HTTP status codes:
- `200 OK`: Success
- `201 Created`: Successfully created (for POST)
- `400 Bad Request`: Validation errors or invalid input
- `404 Not Found`: Resource not found (if applicable)
- `500 Internal Server Error`: Server errors

**Error Response Format:**
```json
{
  "error": "string",
  "message": "string",
  "details": {} // optional
}
```

---

## 6. Date Filtering Logic

### For Expenses (`/Expenses/all-expenses-records?date=YYYY-MM-DD`)
- Compare the `createdAt` date (not time) with the provided date
- If date matches (ignoring time component), include the expense
- If `date` parameter is empty/null/not provided, return all expenses
- Date comparison should be timezone-aware if necessary

**Example:**
- Expense created: `2026-01-03T14:30:00`
- Filter `date=2026-01-03` → **Include** (matches date)
- Filter `date=2026-01-04` → **Exclude** (different date)
- No `date` parameter → **Include** (return all)

---

## 7. Summary Checklist

### Expenses Endpoints:
- [ ] `POST /api/Expenses/add-expense-record` - Create expense
- [ ] `GET /api/Expenses/all-expenses-records` - Get all expenses (with optional date filter)

### Report Endpoints:
- [ ] `GET /api/Report/totalexpenses` - Sum of all expenses
- [ ] `GET /api/Report/totalprofit` - Total Sales - Total Expenses

### Database:
- [ ] Create Expense table/model with fields: id, name, description, cost, createdAt
- [ ] Ensure cost supports decimal values
- [ ] Auto-generate createdAt on creation

### Validation:
- [ ] Validate name is required
- [ ] Validate description is required
- [ ] Validate cost is required and >= 0
- [ ] Validate cost is a valid number/decimal

---

## 8. Testing Recommendations

1. **Create Expense:**
   - Test with valid data
   - Test with missing required fields
   - Test with negative cost (should fail)
   - Test with decimal values (e.g., 123.45)

2. **Get All Expenses:**
   - Test without date filter (should return all)
   - Test with date filter (should return filtered)
   - Test with invalid date format
   - Test with date that has no expenses

3. **Total Expenses Report:**
   - Test with no expenses (should return 0)
   - Test with multiple expenses (should sum correctly)
   - Test decimal precision

4. **Total Profit Report:**
   - Test calculation: Sales - Expenses
   - Test when expenses > sales (negative profit)
   - Test when expenses < sales (positive profit)
   - Test when expenses = sales (zero profit)

---

## 9. Important Notes

1. **API Consistency:** Maintain the same response structure (`{ results: ... }`) as existing endpoints like `/Report/totalsales`

2. **Date Handling:** Be consistent with date formats. Frontend expects ISO 8601 format for `createdAt` fields.

3. **Precision:** Ensure `cost` values maintain proper decimal precision (at least 2 decimal places for currency).

4. **Performance:** For report endpoints, consider caching if the calculations are expensive, especially if the data doesn't change frequently.

5. **Calculations:** 
   - Total Expenses = SUM of all expense.cost
   - Total Profit = (SUM of all sales.totalSales) - (SUM of all expense.cost)

---

## Contact/Questions

If you need clarification on any requirements, please reference:
- Frontend Expense component: `src/components/Expenses.tsx`
- Frontend Expense repository: `src/hooks/ExpenseRepository.ts`
- Frontend Report repository: `src/hooks/ReportRepository.ts`
- Expense entity: `src/entiies/Expense.ts`
- CreateExpense DTO: `src/entiies/Dto/CreateExpense.ts`


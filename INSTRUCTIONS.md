# Feature Implementation Guides

## 1. Role Based Access Control (RBAC)

### 1.1 Overview

We have an admin dashboard (apps/wecycle/admin) where an admin user can manage services, bookings, etc. The dashboard is acessible for 3 roles but they have different permissions. Now, we added another new role (userType) called "CustomerService" and want to grant acess to the dashboard for this new role. So, you are instructed to implement this.

### 1.2 Key Requirements

- **Role-Based Access Control**: Implement role-based access control to restrict some route access to the admin dashboard based on the user's role.
- **New Role**: Add a new role called "CustomerService" with specific permissions to access the dashboard.
- **Allowed Access**: The "CustomerService" role should have access to view services, bookings, and customer details but not edit or delete them. They also won't have access to other than these routes.

## 2. Hauler Onboarding

### 2.1 Overview

We will implement a new onbarding feature in WeCycle web (apps/wecycle/web) for haulers who want to work with us. The "Hauler Onboarding" feature is a multi-step form that collects personal, professional, business-related, vehicle, and legal information from potential haulers. The form should allow for persistent data across steps, client-side validation, error handling, and submitting status indication. You are tasked with implementing this feature.

### 2.2 Key Requirements

- **Multi-step Form**: The form should span across multiple steps, guiding the user through each section.
- **Persistent Data**: Data should persist across steps so that users do not lose progress when navigating between steps.
- **Client-side Validation**: Validate user inputs on each step before proceeding to the next.
- **Error Handling**: Display appropriate error messages when validation fails.
- **Submitting Status**: Indicate loading/submitting state while submitting data to the backend.

---

## 2.3 Steps to Implement

### 1. **Set Up Form Steps**

- Divide the onboarding form into logical steps:

  1.  Personal Information
  2.  Business/Professional Information
  3.  Vehicle and Equipment Information
  4.  Payment Information
  5.  Legal & Compliance
  6.  Documentation Uploads
  7.  Skills and Capabilities
  8.  Additional Preferences
  9.  Optional Referrals

- For navigation between steps, implement a wizard-like interface with "Next" and "Previous" buttons.

### 2. **Implement Persistent State Across Steps**

- Use **React Context API** or a state management solution like **Redux** to store form data persistently across steps.
- Ensure data is maintained across page reloads using browser storage (e.g., **localStorage**, **sessionStorage**) or URL query parameters.
- Consider debouncing the form inputs to minimize the number of times data is saved.

### 3. **Form Validation**

- Use a validation library like **Yup** integrated with **Formik** or **React Hook Form** to validate inputs.
- Validate the following:
  - Personal details (e.g., valid email format, phone number).
  - Required fields such as Vehicle Registration Number, Tax ID, Proof of Insurance, etc.
  - File uploads (e.g., size limit, accepted file formats).
- Display inline error messages near the fields where validation fails.

### 4. **Error Handling**

- Handle form submission errors both client-side and server-side.
- Display user-friendly error messages:
  - Field-specific errors (e.g., "Invalid email format").
  - General form errors (e.g., "Submission failed, please try again").
- Ensure error messages are accessible and do not break form layout.

### 5. **Submitting Status Handling**

- Implement a loading spinner or disabled form state while data is being submitted to the backend.
- Show a clear "Submitting" indicator during form submission.
- Provide feedback on successful or failed submissions with a success or error notification.

### 6. **Backend Integration**

We already have a backend API that accepts hauler onboarding data ("POST /api/provider-request"). But feel free to modify the API as per the requirements here. Ensure the following:

- Format the data according to the backend API requirements.
- Implement error handling for API requests (e.g., network errors, server errors).
- Display appropriate messages to the user based on the API response.

### 7. **Conditional Steps**

- Certain fields or steps should be conditionally shown based on user input (e.g., if the hauler operates as a business, show fields for Business Name and Tax Identification Number).
- Use conditional rendering based on form values to handle this.

### 8. **File Uploads**

- Implement file upload inputs with previews (e.g., using **React Dropzone**).
- Ensure users can upload documents like:
  - Driver’s License
  - Vehicle Registration
  - Proof of Insurance
- Provide file size limits and validate allowed file formats (e.g., JPG, PNG, PDF).

### 9. **Progress Tracking**

- Display a progress bar or indicator to show the user how many steps are completed and how many are remaining.
- Allow users to navigate back to previous steps to review and edit their information before final submission.

### 10. **Final Review & Submission**

- Before submission, provide a review page where the user can see all the information they have entered.
- Include a "Submit" button on the final step, which will:
  - Validate all data across steps.
  - Submit the data to the backend in the required format.
  - Handle success and error states accordingly.

---

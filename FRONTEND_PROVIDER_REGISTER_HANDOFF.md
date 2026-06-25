# Frontend Handoff: Provider Register ID Card Files

## Endpoint

`POST /auth/register/provider`

The provider registration endpoint still uses `multipart/form-data`.

## New Required File Fields

Add these two required file inputs to the provider register form:

| Field name | Required | Type | Notes |
| --- | --- | --- | --- |
| `idCardFrontFile` | Yes | File | Front side of the national ID card |
| `idCardBackFile` | Yes | File | Back side of the national ID card |

The existing CV upload field is unchanged:

| Field name | Required | Type | Notes |
| --- | --- | --- | --- |
| `cvFile` | Conditional | File | Required only when `writtenCv` is not provided |

## Existing CV Rule

The backend still requires one of these:

- `writtenCv`
- `cvFile`

If neither is sent, the backend returns:

```json
{
  "message": "Provider must provide CV text or upload a CV file."
}
```

## New ID Card Rule

Both ID card files must be sent.

If either `idCardFrontFile` or `idCardBackFile` is missing, the backend returns:

```json
{
  "message": "Provider must upload front and back ID card files."
}
```

## FormData Example

```ts
const formData = new FormData();

formData.append('firstName', values.firstName);
formData.append('lastName', values.lastName);
formData.append('email', values.email);
formData.append('mobileNumber', values.mobileNumber);
formData.append('password', values.password);
formData.append('dob', values.dob);
formData.append('city', values.city);
formData.append('state', values.state);
formData.append('nationalNumber', values.nationalNumber);
formData.append('service', values.service);
formData.append('specialization', values.specialization);
formData.append('gender', values.gender);
formData.append('hourPrice', String(values.hourPrice));

if (values.writtenCv) {
  formData.append('writtenCv', values.writtenCv);
}

if (values.cvFile) {
  formData.append('cvFile', values.cvFile);
}

formData.append('idCardFrontFile', values.idCardFrontFile);
formData.append('idCardBackFile', values.idCardBackFile);
```

Do not manually set the `Content-Type` header when sending `FormData`; let the browser set the multipart boundary.

## Successful Response

The successful response shape is unchanged:

```json
{
  "access_token": "...",
  "user": {
    "...": "..."
  }
}
```

The returned provider user may now include:

```json
{
  "cvUrl": "...",
  "idCardFrontUrl": "...",
  "idCardBackUrl": "..."
}
```

## Admin Pending Providers

Admin pending-provider responses now include:

```json
{
  "cvUrl": "...",
  "idCardFrontUrl": "...",
  "idCardBackUrl": "..."
}
```

Use these URLs to show/download the uploaded CV and inspect both ID card images during approval.

## Frontend Checklist

- Add two file inputs named `idCardFrontFile` and `idCardBackFile`.
- Mark both ID card inputs as required in UI validation.
- Keep current `cvFile` behavior unchanged.
- Keep the current `writtenCv` or `cvFile` validation rule.
- Send registration as `multipart/form-data`.
- Update admin pending-provider UI to display front and back ID card images.

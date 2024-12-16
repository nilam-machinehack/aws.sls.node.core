export interface IStatusCode {
  OK: number;
  CREATED: number;
  BAD_REQUEST: number;
  UNAUTHORIZED: number;
  FORBIDDEN: number;
  NOT_FOUND: number;
  CONFLICT: number;
  INTERNAL_SERVER_ERROR: number;
}

export interface IValidationCheck {
  validated: boolean;
  error: any;
}

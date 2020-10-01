export class GqlResponse {
  readonly code: number;
  readonly message: string;
  readonly data?: Object;
  readonly success: boolean;
  constructor(
    message: string,
    data?: Object,
    code: number = 200,
    success: boolean = true
  ) {
    this.message = message;
    this.data = data;
    this.code = code;
    this.success = success;
  }
}

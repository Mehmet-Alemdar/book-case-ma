export class ApiResponse {
  constructor(
    public message: string,
    public data: any,
  ) {}

  static success(message: string = 'Success', data: any) {
    return new ApiResponse(message, data);
  }

  static error(message: string = 'An error', data: any) {
    return new ApiResponse(message, data);
  }
}

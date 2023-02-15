export type ResponseSuccess<T> = Readonly<{ isSuccess: true; data: T }>;
export type ResponseFail<T> = Readonly<{ isSuccess: false; data: T }>;

export type Response<T = string | undefined> = ResponseSuccess<T> | ResponseFail<T>;

export class ResponseFactory {
  static success<T>(data: T): ResponseSuccess<T> {
    return { isSuccess: true, data };
  }
  static fail<T>(data: T): ResponseFail<T> {
    return { isSuccess: false, data };
  }

  static isSuccess<T>(response: Response<T>): response is ResponseSuccess<T> {
    return response.isSuccess;
  }

  static isFail<T>(response: Response<T>): response is ResponseFail<T> {
    return !response.isSuccess;
  }
}

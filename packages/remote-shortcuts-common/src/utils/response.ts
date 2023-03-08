export type ResponseSuccess<T> = Readonly<{ isSuccess: true; data: T }>;
export type ResponseFail<T> = Readonly<{ isSuccess: false; data: T }>;

export type Response<SuccessT, FailT> = ResponseSuccess<SuccessT> | ResponseFail<FailT>;

export class ResponseFactory {
  static success<T>(data: T): ResponseSuccess<T> {
    return { isSuccess: true, data };
  }

  static fail<T>(data: T): ResponseFail<T> {
    return { isSuccess: false, data };
  }

  static isSuccess<SuccessT, FailT>(response: Response<SuccessT, FailT>): response is ResponseSuccess<SuccessT> {
    return response.isSuccess;
  }

  static isFail<SuccessT, FailT>(response: Response<SuccessT, FailT>): response is ResponseFail<FailT> {
    return !response.isSuccess;
  }
}

type middlewareType<T> = (responseBody: any) => T;

interface returnType<T> {
  status: { code: number, message: string }
  data: T | {}
}

interface IProps<T> {
  url: string,
  method: "OPTIONS" | "GET" | "HEAD" | "PUT" | "POST" | "DELETE" | "PATCH",
  middleware?: middlewareType<T>,
  body?: any,
  onRequestEnd?: (returnData: returnType<T>) => void,
  onRequestStart?: () => void,
}

export const kolekt = async <T>(options: Omit<IProps<T>, 'middleware' | 'onRequestStart' | 'onRequestEnd'>, _middleware?:middlewareType<T>): Promise<returnType<T>> => {
  const requestParamas = {
    method: options.method,
    body: options.body
  };

  const response = await fetch(options.url, requestParamas);
  if (response.headers.get('content-type')?.includes('application/json')) {
    const responseData = await response.json();
    return {
      status: { code: response.status, message: response.statusText },
      data: _middleware ? _middleware(responseData) : responseData
    };
  } else return { status: { code: response.status, message: response.statusText }, data: {} };
}

const useKolekt = <T = any>({ url, middleware, method, body, onRequestStart, onRequestEnd }: IProps<T>) => {
  const sendRequest = async (_middleware?: middlewareType<T>):Promise<returnType<T>> => {
    if (onRequestStart) onRequestStart();
    const response = await kolekt<T>({ url, method, body }, _middleware);
    response.data = middleware ? middleware(response.data) : response.data;
    if (onRequestEnd) onRequestEnd(response);
    return response;
  };
  return {
    kolekt: sendRequest,
  }
}

export default useKolekt;

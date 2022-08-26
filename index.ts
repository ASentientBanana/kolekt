type middlewareType<T> = (responseBody: any) => T;

interface IReturnType<T> {
  status: { code: number, message: string }
  data?: T 
}

interface IProps<T> {
  url: string,
  method: "OPTIONS" | "GET" | "HEAD" | "PUT" | "POST" | "DELETE" | "PATCH",
  middleware?: middlewareType<T>,
  body?: any,
  onRequestEnd?: (returnData: IReturnType<T>) => void,
  onRequestStart?: () => void,
  headers?: Headers
}

export const kolekt = async <T = any>(options: Omit<IProps<T>, 'middleware' | 'onRequestStart' | 'onRequestEnd'>, _middleware?:middlewareType<T>): Promise<IReturnType<T>> => {
  
  const requestParams = {
    headers: options.headers,
    method: options.method,
    body: options.body
  };

  const response = await fetch(options.url, requestParams);
  if (response.headers.get('content-type')?.includes('application/json')) {
    const responseData = await response.json();
    return {
      status: { code: response.status, message: response.statusText },
      data: _middleware ? _middleware(responseData) : responseData
    };
  } else return { status: { code: response.status, message: response.statusText } };
}

const useKolekt = <T = any>({ url, middleware, method, body, onRequestStart, onRequestEnd }: IProps<T>) => {
  const sendRequest = async (_middleware?: middlewareType<T>):Promise<IReturnType<T>> => {
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

type middlewareType = (responseBody: any) => any;

interface returnData<T> {
  status: { code: number, message: string }
  data: T
}

interface IProps<T> {
  url: string,
  method: "OPTIONS" | "GET" | "HEAD" | "PUT" | "POST" | "DELETE" | "PATCH",
  middleware?: middlewareType,
  body?: any,
  onRequestEnd?: (returnData: returnData<T | any>) => void,
  onRequestStart?: () => void,
}

export const kolekt = async <T>(options: Omit<IProps<T>, 'middleware' | 'onRequestStart' | 'onRequestEnd'>, _middleware?:middlewareType): Promise<returnData<T|any>> => {
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

const useKolekt = <T>({ url, middleware, method, body, onRequestStart, onRequestEnd }: IProps<T>) => {
  const sendRequest = async (_middleware?: middlewareType):Promise<ReturnType<T | any>> => {
    if (onRequestStart) onRequestStart();
    const response = await kolekt({ url, method, body }, _middleware);
    response.data = middleware ? middleware(response.data) : response.data;
    if (onRequestEnd) onRequestEnd(response);
    return response;
  };
  return {
    kolekt: sendRequest,
  }
}

export default useKolekt;

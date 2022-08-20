type middlewareType = (responseBody: any) => any;

interface returnData {
  status: { code: number, message: string }
  data: any
}

interface IProps {
  url: string,
  method: "OPTIONS" | "GET" | "HEAD" | "PUT" | "POST" | "DELETE" | "PATCH",
  middleware?: middlewareType,
  body?: any,
  onRequestEnd?: (returnData: returnData) => void,
  onRequestStart?: () => void,
}

export const kolekt = async <T>(options: Omit<IProps, 'middleware' | 'onRequestStart' | 'onRequestEnd'>, _middleware?: (_body: any) => any): Promise<returnData> => {
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

const useKolekt = ({ url, middleware, method, body, onRequestStart, onRequestEnd }: IProps) => {
  const sendRequest = async (_middleware?: middlewareType) => {
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

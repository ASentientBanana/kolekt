# Kolektor

## A wrapper for the default fetch api to make some more complex use cases easier to work with, without adding too much bloat.


## **Usage:**

```typescript

const { kolekt } = useKolekt({
    url: "https://jsonplaceholder.typicode.com/posts", // Request url
    method: "POST", 
    middleware?: (requestData)=>{ return requestData.map((e)=>{
        return {title:e.title}
    })},
    body: JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1,
  }),
   headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
    onRequestStart?: () => {
        console.log("Request started");
    },
    onRequestEnd?: (returnData) =>{
        console.log("Response data:");
        conosle.log(returnData);
        console.log("Request done");
    },
});

kolekt();

```

## **useKolekt**
This works similar to a react hook.
When calling useKolekt only 2 params are required. 
```
url, method
```

Calling useKolekt returns the kolekt function and doesn't invoke the request it self.

To invoke the request call the kolekt function.
 
---   

## **middleware:**
This is a optional callback. It is called on the response data on every request.


## **onRequestStart:**
This is a lifecycle function called before the request is made.


## **onRequestEnd:**
This is a lifecycle function called after the request is over.
It is passed the response data after running the middleware function.

## **body:**
Optional param, this is the request body.

## **headers:**
Optional param, these are the request headers.

## **kolekt():**
Calling this functions sends the request defined when calling the useKolekt hook.\
This functions accepts an optional middleware param.
it can be invoked normally.
```javascript
    await kolekt() 
```
or with the middleware callback
```javascript
//Currently the type of the responseData param is any.
    await kolekt((responseData)=>{
        return parseData(responseData);
    }) 
```
This is called on the specific request and is independent from the middleware  passed to useKolekt.\
The middleware passed to useKolekt is called after the middleware passed to kolekt directly.

---

## **Response data and typing:**
There is full support for typescript. The function useKolket can take in an expected return type:
```typescript
const { kolekt } = useKolekt<someType>({...})

const res = await kolekt();
// the type of res is Promise<IReturnType<someType>>

``` 

where return type is:

```typescript
interface IReturnType<T> {
  status: { code: number, message: string }
  data?: T 
} 

or

interface IReturnType<someType> {
  status: { code: number, message: string }
  data?: someType 
}

```
The default type for the response data, is any.
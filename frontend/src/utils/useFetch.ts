import { useEffect, useState } from "react"

interface useFetchResponse<T> {
  data: T | undefined;
  isLoading: boolean;
  error: T | undefined;
};

export function useFetch<T>(url: string, init?: RequestInit, func?: (data: unknown) => unknown): useFetchResponse<T> {
  const [data, setData] = useState<T>()
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState()

  useEffect(() => {
    fetch(url, {
      headers: {
        authorization: `Bearer ${localStorage.accessToken}`,
        'Content-Type': 'application/json'
      },
      ...init
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        if (func) setData(func(data) as T)
        else setData(data)
      })
      .catch(error => {
        console.log("Error fetching data: ", error);
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { data, isLoading, error }
}

export function useFetchPost<T>(url: string, init?: RequestInit): useFetchResponse<T> {
  return useFetch<T>(url, { method: 'POST', ...init })
}

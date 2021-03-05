import { useState } from "react"

interface useFetchResponse {
  data: unknown | undefined;
  isLoading: boolean;
  error: unknown | undefined;
};

const useFetch = (url: string, init?: RequestInit): useFetchResponse => {
  const [data, setData] = useState()
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState()

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
      setData(data)
    })
    .catch(error => {
      console.log("Error fetching data: ", error);
      setError(error)
    })
    .finally(() => {
      setLoading(false)
    })

  return { data, isLoading, error }
}

const useFetchPost = (url: string, init?: RequestInit): useFetchResponse => useFetch(url, { method: 'POST', ...init })

export { useFetch, useFetchPost }
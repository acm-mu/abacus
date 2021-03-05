import { useState } from "react"

interface useFetchProps {
  url: string;
  init: RequestInit | undefined;
};

interface useFetchResponse {
  data: any | undefined;
  isLoading: boolean;
  error: any | undefined;
};

const useFetch = ({url, init} : useFetchProps => {
  const [data, setData] = useState()
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState()

  fetch(url, {
    ...init
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw response
    })

  return { data, isLoading, error }
}

export default useFetch
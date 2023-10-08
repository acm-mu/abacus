import {useEffect} from 'react'

const usePageTitle = (pageTitle:  undefined | string = undefined) => {
  useEffect(() => {
    if (pageTitle) document.title = pageTitle
  }, [pageTitle])
}

export default usePageTitle
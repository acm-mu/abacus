import React, {useEffect} from 'react'

const usePageTitle = (pageTitle: (() => string) | undefined | string = undefined, dependencies: React.DependencyList = []) => {
  const getValue = () => pageTitle instanceof Function ? pageTitle() : pageTitle

  useEffect(() => {
    const value = getValue()
    if (value) document.title = value
  }, [...dependencies, pageTitle])
}

export default usePageTitle
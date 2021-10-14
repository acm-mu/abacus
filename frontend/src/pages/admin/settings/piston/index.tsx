import React, { Dispatch, createContext, SetStateAction, useEffect, useState, useMemo } from "react"
import { Checkbox, Input } from "semantic-ui-react"
import { PageLoading } from "components"
import config from 'environment'
import LanguageBlock from "./LanguageBlock"
import './Piston.scss'

export type Language = {
  name: string
  version: string
  status: string
}

type PistonContextType = {
  languages: Language[] | undefined
  setLanguages: Dispatch<SetStateAction<Language[]>>
}

export const PistonContext = createContext<PistonContextType>({
  languages: undefined,
  setLanguages: () => {
    return
  }
})

const Piston = (): JSX.Element => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)

  const [search, setSearch] = useState<string>()
  const [onlyInstalled, setOnlyInstalled] = useState(false)

  const loadLanguages = async () => {
    const response = await fetch(`${config.PISTON_URL}/api/v2/packages`)
    const data = await response.json()
    if (!isMounted) return

    setLanguages(
      data.map((e: Record<string, string | boolean>) => ({
        name: e.language,
        version: e.language_version,
        status: e.installed ? 'installed' : 'not-installed'
      }))
    )
    setLoading(false)
  }

  useEffect(() => {
    loadLanguages()
    return () => setMounted(false)
  }, [])

  const filteredLanguages = useMemo(() => languages
    .filter(language => !onlyInstalled || language.status == 'installed')
    .filter(language => search ? language.name.toLowerCase().includes(search) : true), [languages, search, onlyInstalled])

  if (isLoading) return <PageLoading />

  return (
    <PistonContext.Provider value={{ languages, setLanguages }}>
      <div id='control-bar'>
        <Input icon='search' iconPosition='left' placeholder="Python" value={search} onChange={(_, { value }) => setSearch(value.toLowerCase())} />
        <Checkbox toggle label="Only Installed" checked={onlyInstalled} onChange={() => setOnlyInstalled(!onlyInstalled)} />
      </div>
      <div className='grid'>
        {filteredLanguages.length > 0 ? filteredLanguages.map((language) =>
          <LanguageBlock key={`${language.name}-${language.version}`} language={language} />
        ) : <h3>No item(s).</h3>}
      </div>
    </PistonContext.Provider>
  )
}

export default Piston

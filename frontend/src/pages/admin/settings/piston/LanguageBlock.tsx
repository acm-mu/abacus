import React, { useContext, useState } from 'react'
import config from 'environment'
import { Language, PistonContext } from '.'
import { Loader } from 'semantic-ui-react'

type LanguageBlockProps = {
  language: Language
}

const LanguageBlock = ({ language }: LanguageBlockProps): JSX.Element => {
  const { name, version } = language
  const [status, setStatus] = useState(language.status)
  const [showOptions, setShowOptions] = useState(false)

  const { languages, setLanguages } = useContext(PistonContext)

  const installPackage = async () => {
    if (!languages) return

    console.log(`Submitting request to install ${name} (version ${version})`)

    setStatus('Installing...')
    await fetch(`${config.PISTON_URL}/api/v2/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: name,
        version
      })
    })
    setStatus('installed')
    setLanguages(
      languages.map((lang) => (lang.name == name && lang.version == version ? { ...lang, status: 'installed' } : lang))
    )
  }

  const uninstallPackage = async () => {
    if (!languages) return

    console.log(`Submitting request to uninstall ${language.name} (version ${language.version})`)

    setStatus('Deleting...')
    await fetch(`${config.PISTON_URL}/api/v2/packages`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: name,
        version
      })
    })
    setStatus('not-installed')
    setLanguages(
      languages.map((lang) =>
        lang.name == name && lang.version == version ? { ...lang, status: 'not-installed' } : lang
      )
    )
  }

  return (
    <div className={`grid-item ${status}`} onClick={() => setShowOptions(!showOptions)}>
      <div className="grid-item-inner">
        <span>
          <h3>{name}</h3>
          <i>{version}</i>
        </span>

        {status.includes('...') ? (
          <Loader active indeterminate size="medium" inline="centered">
            {showOptions ? undefined : status}
          </Loader>
        ) : status == 'installed' ? (
          <>
            <p className="status installed">Installed</p>
            <button
              className="uninstall"
              style={{ display: showOptions ? 'inline-block' : 'none' }}
              onClick={uninstallPackage}>
              Uninstall
            </button>
          </>
        ) : (
          <>
            <p className="status not-installed">Not Installed</p>
            <button
              className="install"
              style={{ display: showOptions ? 'inline-block' : 'none' }}
              onClick={installPackage}>
              Install
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default LanguageBlock

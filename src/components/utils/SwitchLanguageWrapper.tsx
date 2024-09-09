"use client"

import { LanguageContext } from "@/context/LanguageContext"
import { ELanguage } from "@/utils/enum"
import { useContext } from "react"
import { Dropdown, NavDropdown, SplitButton } from "react-bootstrap"
import { useTranslation } from "react-i18next"

const SwitchLanguage = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language

  const { switchLanguage } = useContext(LanguageContext)
  return (
    <>
      <NavDropdown
        id="language-nav-dropdown"
        // drop="end"
        align={"end"}
        menuVariant="transparent"
        title={t(`language.${currentLanguage}`)}
      >
        {Object.keys(ELanguage).map((_languageKey, index) => {
          const _languageValue =
            ELanguage[_languageKey as keyof typeof ELanguage]
          return (
            <Dropdown.Item
              onClick={() => switchLanguage(_languageValue)}
              key={index}
              eventKey={index}
            >
              {t(`language.${_languageValue}`)}
            </Dropdown.Item>
          )
        })}
      </NavDropdown>
    </>
  )
}

export default SwitchLanguage

"use client"

import { Col, Offcanvas, Row } from "react-bootstrap"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ImageWrapper from "@/components/utils/ImageWrapper"
import SwitchLanguage from "@/components/utils/SwitchLanguageWrapper"
import Link from "next/link"
import { defaultImage } from "@/utils/default"

const NavbarWrapper = () => {
  // import
  const { t } = useTranslation()
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false)
  const { data: session } = useSession()
  const router = useRouter()

  // variable

  // render
  return (
    <Container className="sticky-top py-0">
      <Row id="navbar-top">
        <Col xs={4} md={3} className="text-start pt-3">
          Board
        </Col>
        <Col xs={4} md={6} className="text-center">
          <Link href={"/"}>
            <ImageWrapper
              src={"/logo.png"}
              alt={"logo"}
              objectFit="contain"
              id="logo-image"
            />
          </Link>
        </Col>
        <Col xs={4} md={3} className="text-end pt-3">
          <SwitchLanguage />
        </Col>
      </Row>
    </Container>
  )
}

export default NavbarWrapper

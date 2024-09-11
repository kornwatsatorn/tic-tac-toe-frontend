"use client"

import { Button, Col, Offcanvas, Row, Table } from "react-bootstrap"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ImageWrapper from "@/components/utils/ImageWrapper"
import SwitchLanguage from "@/components/utils/SwitchLanguageWrapper"
import Link from "next/link"

import ToastWrapper from "../ToastWrapper"
import { useLoading } from "@/context/LoadingContext"
import fetchApi from "@/utils/axios"

interface IBoard {
  _id: string
  id: string
  email: string
  name: string
  point: number
  stack: number
  createdAt: string
  updatedAt: string
}
const NavbarWrapper = () => {
  // import
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { setLoading } = useLoading()

  // variable
  const [isShow, setIsShow] = useState<boolean>(false)
  const [board, setBoard] = useState<IBoard[]>([])

  // methods
  const handleGetData = async () => {
    try {
      setLoading(true)
      const _res = await fetchApi.get("/users/leader-board")
      const _data = _res.data.data.data
      setBoard(_data.data)
    } catch (error: any) {
    } finally {
      setLoading(false)
    }
  }

  // watch
  useEffect(() => {
    if (isShow) {
      handleGetData()
    }
  }, [isShow])

  // render
  return (
    <>
      <Container className="sticky-top py-0">
        <Row id="navbar-top">
          <Col xs={4} md={3} className="text-start pt-3">
            <Button variant="light" onClick={() => setIsShow(true)}>
              {t("label.rank")}
            </Button>
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
      <ToastWrapper
        title={t("label.leaderBoard")}
        message={
          <Table>
            <thead>
              <tr>
                <th className="text-center">{t("label.rank")}</th>
                <th>{t("label.name")}</th>
                <th className="text-center">{t("label.point")}</th>
              </tr>
            </thead>
            <tbody>
              {board.map((_data, _index) => (
                <tr key={_index}>
                  <td className="text-center">{_index + 1}</td>
                  <td>{_data.name}</td>
                  <td className="text-center">{_data.point}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
        isShow={isShow}
        setIsShow={setIsShow}
      />
    </>
  )
}

export default NavbarWrapper

"use client"

import { Button, Col, Row } from "react-bootstrap"
import Container from "react-bootstrap/Container"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ImageWrapper from "@/components/utils/ImageWrapper"
import { defaultImage } from "@/utils/default"
import { useLoading } from "@/context/LoadingContext"

const FooterWrapper = () => {
  // import
  const { t } = useTranslation()
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false)
  const { data: session } = useSession()
  const router = useRouter()
  const { setLoading } = useLoading()

  // methods
  const onclickSignOut = async () => {
    setLoading(true)
    await signOut({ callbackUrl: "/login" })
  }
  if (!session) {
    return
  }
  // render
  return (
    <div className="sticky-bottom bg-white">
      <Container>
        <Row id="footer-bottom" className="align-items-center">
          <Col xs={5} md={4} className="text-start">
            <div className="d-flex align-items-center">
              <div>
                <ImageWrapper
                  src={session?.user?.displayImage ?? defaultImage}
                  height="40px"
                  width="40px"
                  className="rounded-circle"
                />
              </div>
              <div className="flex-fill ms-2  text-ellipsis">
                <p className="mb-0 small text-ellipsis">
                  {session?.user?.displayName} {session?.user?.displayName}{" "}
                  {session?.user?.displayName} {session?.user?.displayName}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={2} md={2} className="text-start">
            <h4 className="mb-0">{session?.user?.point}</h4>
          </Col>
          <Col xs={5} md={6} className="text-end">
            <Button variant="danger" onClick={onclickSignOut}>
              {t("button.logout")}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FooterWrapper

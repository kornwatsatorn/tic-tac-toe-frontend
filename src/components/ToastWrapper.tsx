import { Toast, ToastContainer } from "react-bootstrap"
import ImageWrapper from "./utils/ImageWrapper"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import classNames from "classnames"

interface IProps {
  title?: string
  message: JSX.Element
  isShow: boolean
  setIsShow: Dispatch<SetStateAction<boolean>>
}
const ToastWrapper = ({ title, message, isShow, setIsShow }: IProps) => {
  return (
    <div
      className={classNames("position-fixed", isShow ? "" : "d-none")}
      style={{
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1050,
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <ToastContainer
        className="p-3"
        position={"middle-center"}
        style={{ zIndex: 1 }}
      >
        <Toast
          show={isShow}
          onClose={() => setIsShow(false)}
          className="position-static"
        >
          <Toast.Header>
            <ImageWrapper
              src={"/logo.png"}
              alt={"logo"}
              width="20px"
              height="20px"
            />
            <strong className="me-auto">{title ?? "Tic Tac Toe"}</strong>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}

export default ToastWrapper

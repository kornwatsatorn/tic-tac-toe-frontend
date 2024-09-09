"use client"

import { useLoading } from "@/context/LoadingContext"
import { formatTime } from "@/utils"
import fetchApi from "@/utils/axios"
import { KMatchId } from "@/utils/keyStorage"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import Style from "./style.module.css"
import classNames from "classnames"
import { useSession } from "next-auth/react"
import { useTranslation } from "react-i18next"
import ImageWrapper from "@/components/utils/ImageWrapper"

interface IPlayer {
  player1: string
  player2: string
}

const HomePage = () => {
  // import
  const { setLoading } = useLoading()
  const { data: session, update } = useSession()
  const { t } = useTranslation()
  // variable
  /**
   * step
   * 0 is ready to join
   * 1 is waiting match
   * 2 is playing
   * 3 is game end show winner
   */
  const [step, setStep] = useState<number>(0)
  const [timeCounter, setTimeCounter] = useState<number>(0)
  const [intervalData, setIntervalData] = useState<NodeJS.Timeout>()
  const [matchId, setMatchId] = useState<string>("")
  const [replay, setReplay] = useState<any[]>([])
  const [player, setPlayer] = useState<IPlayer | null>()
  const [disabledSlot, setDisabledSlot] = useState<boolean>(false)
  const [isWinner, setIsWinner] = useState<boolean | null>(null)

  // methods
  const handleJoinMatch = async (mode: "player" | "bot" = "player") => {
    try {
      setLoading(true)
      setIsWinner(null)
      const _res = await fetchApi.get("/match")
      const _data = _res.data.data.data
      console.log(
        "%csrc/app/(pages)/page.tsx:44 _data",
        "color: #007acc;",
        _data
      )
      sessionStorage.setItem(KMatchId, _data.match._id)
      setMatchId(_data.match._id)
      if (_data.match.status === "waiting") {
        setStep(1)
      } else if (_data.match.status === "playing") {
        updateActiveSlot(_data.currentTurn)
        setDataPlayer(_data.match)
        setStep(2)
      }
    } catch (error) {
      console.log(
        "%csrc/app/(pages)/page.tsx:59 error",
        "color: #007acc;",
        error
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSelectSlot = async (slot: number) => {
    try {
      if (disabledSlot) {
        throw new Error("Opponent turn")
      }
      setDisabledSlot(true)
      await fetchApi.post("/match/play", {
        data: { slot, matchId },
      })
    } catch (error) {}
  }

  // utile
  const getValueSlot = (slot: number) => {
    let _value = null
    const _find = replay.find((_replay) => _replay.slot === slot)
    if (_find) {
      _value =
        _find.player === player?.player1 ? "/images/x.png" : "/images/o.png"
    }
    return _value
  }

  const setDataPlayer = (_match: any) => {
    setPlayer({
      player1: _match.player1,
      player2: _match.player2,
    })
  }

  const updatePointSession = async (point: number) => {
    await update({
      user: {
        ...session?.user,
        point: point,
      },
    })
  }
  const updateActiveSlot = (player: string) => {
    setDisabledSlot(session?.id !== player)
  }

  // watch connect sse
  useEffect(() => {
    if (matchId) {
      const eventSource = new EventSource(`/api/sse/${matchId}`)

      // // Listen for events
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.message) {
          updateActiveSlot(data.currentTurn)
          if (data.message === "START") {
            setDataPlayer(data.match)
            setStep(2)
          } else if (data.message === "UPDATE") {
            setReplay(data.match.replay)
          } else if (data.message === "END") {
            // reset
            if (session?.id === data.match.player1) {
              updatePointSession(data.point.player1)
            } else {
              updatePointSession(data.point.player2)
            }
            setIsWinner(data.match.winner === session?.id)
            setDisabledSlot(true)
            setReplay([])
            setMatchId("")
            setPlayer(null)
            setStep(3)
            eventSource.close()
          }
        }
      }

      // // Error handling
      eventSource.onerror = (error) => {
        console.error("SSE error:", error)
        eventSource.close()
      }

      // // Clean up when component unmounts
      return () => {
        eventSource.close()
      }
    }
  }, [matchId])

  // Effect to start the counter when step is set to 1
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (step === 1) {
      // Start the counter when step is 1
      intervalId = setInterval(() => {
        setTimeCounter((prev) => prev + 1)
      }, 1000)
      setIntervalData(intervalId)
    } else {
      clearInterval(intervalData)
    }
  }, [step])

  // render
  return (
    <section className="d-flex justify-content-center align-items-center height-same-outer">
      {/* button play */}
      {step === 0 && (
        <Container>
          <Row className="gap-3">
            <Col xs={12} className="text-center">
              <Button
                variant="primary"
                onClick={() => handleJoinMatch("player")}
              >
                {t("label.online")}
              </Button>
            </Col>
            <Col xs={12} className="text-center">
              <Button
                variant="secondary"
                onClick={() => handleJoinMatch("bot")}
              >
                {t("label.bot")}
              </Button>
            </Col>
          </Row>
        </Container>
      )}

      {step === 1 && (
        <Container>
          <Row>
            <Col xs={12} className="text-center">
              <h2>{formatTime(timeCounter)}</h2>
            </Col>
          </Row>
        </Container>
      )}

      {step === 2 && (
        <Container>
          <div className={classNames(Style["panel-game"])}>
            {!disabledSlot ? <>You</> : <>Opponent</>}
            <Row className={classNames(Style["board-game"])}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_slot: number) => (
                <Col xs={4} key={_slot} onClick={() => handleSelectSlot(_slot)}>
                  <div className="ratio ratio-1x1">
                    <div className=" d-flex justify-content-center align-items-center">
                      {/* {_slot} */}
                      {getValueSlot(_slot) && (
                        <ImageWrapper src={getValueSlot(_slot)} />
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      )}

      {step === 3 && (
        <Container>
          <Row>
            <Col xs={12} className="text-center">
              <h2>{t("label.gameover")}</h2>
              <h3>{isWinner ? t("label.winner") : t("label.loser")}</h3>
              <Button onClick={() => setStep(0)}>Ok</Button>
            </Col>
          </Row>
        </Container>
      )}
    </section>
  )
}

export default HomePage
